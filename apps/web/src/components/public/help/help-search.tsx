"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";

import { helpArticles, helpCategories } from "./help-content";
import styles from "./help.module.css";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function HelpSearch() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalize(deferredQuery);
    if (!normalizedQuery) {
      return helpArticles;
    }

    return helpArticles.filter((article) =>
      normalize(`${article.category} ${article.question} ${article.answer}`).includes(
        normalizedQuery,
      ),
    );
  }, [deferredQuery]);

  return (
    <div className={styles.helpCentre}>
      <div className={styles.searchPanel}>
        <label htmlFor={searchId}>Search the Help Centre</label>
        <input
          id={searchId}
          name="help-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try target odds or settlement"
          type="search"
          value={query}
        />
        <p aria-live="polite" className={styles.resultCount}>
          {filteredArticles.length === 1
            ? "1 answer"
            : `${filteredArticles.length} answers`}
        </p>
      </div>

      {filteredArticles.length === 0 ? (
        <div className={styles.noResults} role="status">
          <h2>No matching answer</h2>
          <p>Try a shorter phrase such as pricing, Daily Edge, or responsible play.</p>
        </div>
      ) : (
        <div className={styles.categoryList}>
          {helpCategories.map((category) => {
            const articles = filteredArticles.filter(
              (article) => article.category === category,
            );
            if (articles.length === 0) {
              return null;
            }

            return (
              <section className={styles.category} key={category}>
                <h2>{category}</h2>
                <div className={styles.answers}>
                  {articles.map((article) => (
                    <details id={article.id} key={article.id}>
                      <summary>{article.question}</summary>
                      <p>{article.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
