// src/components/EmotionCache.tsx
"use client"; // Mark this component as a Client Component is crucial for hooks used within

import * as React from "react";
import createCache from "@emotion/cache"; // Function to create an Emotion cache instance
import { useServerInsertedHTML } from "next/navigation"; // Next.js hook to inject styles during SSR
import { CacheProvider as EmotionCacheProvider } from "@emotion/react"; // Emotion's provider component
import type {
  EmotionCache,
  Options as EmotionCacheOptions,
} from "@emotion/cache"; // TypeScript types

// Define the expected properties for this component
export type NextAppDirEmotionCacheProviderProps = {
  options: Omit<EmotionCacheOptions, "insertionPoint">; // Cache configuration options
  CacheProvider?: (props: {
    // Optional custom CacheProvider component
    value: EmotionCache;
    children: React.ReactNode;
  }) => React.JSX.Element | null;
  children: React.ReactNode; // The rest of your app
};

// The main component
export default function NextAppDirEmotionCacheProvider(
  props: NextAppDirEmotionCacheProviderProps
) {
  const { options, CacheProvider = EmotionCacheProvider, children } = props;

  // Using React state to create and manage the Emotion cache instance
  // This ensures the cache is created only once per component instance
  const [registry] = React.useState(() => {
    const cache = createCache(options); // Create the actual cache with provided options
    cache.compat = true; // Enable compatibility mode if needed
    const prevInsert = cache.insert; // Store the original insert method
    let inserted: { name: string; isGlobal: boolean }[] = []; // Array to track inserted styles

    // Override the cache's insert method to track styles
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      // Check if this style (by name) hasn't been inserted yet
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }
      // Call the original insert method
      return prevInsert(...args);
    };

    // Function to return the tracked styles and clear the tracker
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    // Return the cache instance and the flush function
    return { cache, flush };
  });

  // This is the core Next.js integration hook
  useServerInsertedHTML(() => {
    // Flush (get and clear) the styles inserted during server rendering
    const inserted = registry.flush();
    // If no styles were inserted, do nothing
    if (inserted.length === 0) {
      return null;
    }
    let styles = "";
    let dataEmotionAttribute = registry.cache.key; // Get the cache key (e.g., 'mui')

    const globals: { name: string; style: string }[] = []; // Array for global styles

    // Process the inserted styles
    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style === "string") {
        // Ensure style is a string
        if (isGlobal) {
          // Separate global styles (like CssBaseline)
          globals.push({ name, style });
        } else {
          // Append regular component styles
          styles += style;
          dataEmotionAttribute += ` ${name}`; // Append style name to data-emotion attribute
        }
      }
    });

    // Return React fragments containing <style> tags for server-side injection
    return (
      <React.Fragment>
        {/* Inject global styles */}
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }} // Inject CSS string directly
          />
        ))}
        {/* Inject component styles */}
        {styles && (
          <style
            data-emotion={dataEmotionAttribute}
            dangerouslySetInnerHTML={{ __html: styles }} // Inject CSS string directly
          />
        )}
      </React.Fragment>
    );
  });

  // Wrap the children with Emotion's CacheProvider, passing the created cache instance
  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
