export const DATABASES = {
  duckdb: {
    name: "DuckDB",
    explain_query: "EXPLAIN (ANALYZE, FORMAT JSON)\n[your-query]",
    exampleKeys: ["duck test 1"],
    loadExamples: async () => {
      const { default: examples } = await import("./examples/duckdb");
      return examples;
    },
  },
  postgresql: {
    name: "PostgreSQL",
    explain_query: "EXPLAIN (ANALYZE, FORMAT JSON, VERBOSE, BUFFERS)\n[your-query]",
    exampleKeys: ["default"],
    loadExamples: async () => {
      const { default: examples } = await import("./examples/postgresql");
      return examples;
    },
  },
} as const;

export type Databases = typeof DATABASES;
export type DatabaseKey = keyof Databases;
