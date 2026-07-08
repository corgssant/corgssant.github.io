module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Admin (Decap CMS) is passthrough-only: keep it out of collections/sitemap
  eleventyConfig.ignores.add("src/admin/**");

  // Collections
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/services/*.md").sort((a, b) => {
      return (a.data.order || 99) - (b.data.order || 99);
    });
  });

  eleventyConfig.addCollection("steel", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/steel-buildings/*.md").sort((a, b) => {
      return (a.data.order || 99) - (b.data.order || 99);
    });
  });

  eleventyConfig.addCollection("areas", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/areas/*.md").sort((a, b) => {
      return a.data.title.localeCompare(b.data.title);
    });
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  // Date filter
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  });

  // Copyright year
  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  // ISO date filter (JSON-LD datePublished)
  eleventyConfig.addFilter("dateISO", function(date) {
    return new Date(date).toISOString().split('T')[0];
  });

  // Excerpt filter
  eleventyConfig.addFilter("excerpt", function(content) {
    if (!content) return '';
    const text = content.replace(/<[^>]+>/g, '');
    return text.substring(0, 160) + (text.length > 160 ? '...' : '');
  });

  // Where filter (filter array of objects by key === value)
  eleventyConfig.addFilter("where", function(arr, key, value) {
    return (arr || []).filter(item => item[key] === value);
  });

  // Limit filter
  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
