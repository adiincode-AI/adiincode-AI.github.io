(function () {
  "use strict";

  const path = window.location.pathname;
  const basePath = path.endsWith("/")
    ? path.slice(0, -1)
    : path.substring(0, path.lastIndexOf("/"));
  const POSTS_DIR = `${basePath}/posts/`;

  function getSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get("post") || "post";
  }

  function parseFrontMatter(raw) {
    const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
    if (!match) return { meta: {}, body: raw };

    const [, block, body] = match;
    const meta = {};

    block.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();

      if (/^\[.*\]$/.test(value)) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      } else {
        value = value.replace(/^["']|["']$/g, "");
      }
      meta[key] = value;
    });

    return { meta, body };
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function estimateReadingTime(text) {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }

  function renderMeta(meta, body) {
    document.title = meta.title ? `${meta.title} | Blog` : "Blog";

    const set = (id, value, attr) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!value) return;
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    };

    set("meta-category", meta.category);
    set("meta-title", meta.title || "Untitled");
    set("meta-description", meta.description);
    set("meta-author", meta.author);
    set("meta-date", formatDate(meta.date));
    set("meta-reading-time", estimateReadingTime(body));

    if (meta.cover) {
      const cover = document.getElementById("meta-cover");
      cover.src = meta.cover;
      cover.alt = meta.title || "";
      cover.style.display = "block";
    }

    const tagsEl = document.getElementById("meta-tags");
    if (meta.tags && tagsEl) {
      const tags = Array.isArray(meta.tags) ? meta.tags : [meta.tags];
      tagsEl.innerHTML = tags
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join("");
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderBody(body) {
    const container = document.getElementById("markdown-body");
    marked.setOptions({
      breaks: false,
      gfm: true,
    });
    container.innerHTML = marked.parse(body);

    container.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  function initProgressBar() {
    const bar = document.getElementById("progress-bar");
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initScrollToTop() {
    const btn = document.getElementById("scroll-to-top");
    const onScroll = () => {
      btn.classList.toggle("visible", window.scrollY > 480);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  function showError(message) {
    const container = document.getElementById("markdown-body");
    container.innerHTML = `<p style="color:var(--ink-faint)">${escapeHtml(
      message,
    )}</p>`;
    document.getElementById("meta-title").textContent = "Post not found";
  }

  async function loadMoreBlogs() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      // FIX 1: Changed "id" to "post" to match your existing URL structure
      const currentPostId = urlParams.get("post");

      const response = await fetch("posts.json");
      if (!response.ok) throw new Error("Could not load posts.json");

      const allPosts = await response.json();

      const filteredPosts = allPosts.filter(
        (post) => post.id !== currentPostId,
      );
      const postsToShow = filteredPosts.slice(0, 3);
      const gridContainer = document.getElementById("more-blogs-grid");

      const cardsHTML = postsToShow
        .map((post) => {
          return `
            <a href="blog.html?post=${post.id}" class="blog-card">
                <span class="badge">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <span class="publish-date">${post.date} &middot; ${post.readTime}</span>
            </a>
          `;
        })
        .join("");

      gridContainer.innerHTML = cardsHTML;
    } catch (error) {
      console.error("Error loading more blogs:", error);
      document.querySelector(".more-blogs-section").style.display = "none";
    }
  }

  async function init() {
    initProgressBar();
    initScrollToTop();

    const slug = getSlug();
    const url = `${POSTS_DIR}${slug}.md`;

    console.log("Attempting to fetch from:", url);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Could not load ${url}`);
      const raw = await res.text();
      const { meta, body } = parseFrontMatter(raw);

      renderMeta(meta, body);
      renderBody(body);
      
      // FIX 3: Moved loadMoreBlogs() inside the init() function so it runs AFTER the HTML loads
      await loadMoreBlogs();
      
    } catch (err) {
      console.error(err);
      showError(
        "This post couldn't be loaded. Check that the markdown file exists and the ?post= slug is correct.",
      );
    }
  }

  // NOTE: I removed the stray loadMoreBlogs() call that was floating here

  document.addEventListener("DOMContentLoaded", init);
})();