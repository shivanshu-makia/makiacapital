const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOGS_DIR = path.join(__dirname, '..', 'public', 'content', 'blogs');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'content', 'blog-index.json');

function buildBlogIndex() {
  if (!fs.existsSync(BLOGS_DIR)) {
    console.log('No blogs directory found, creating empty index');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([]));
    return;
  }

  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
    const { data } = matter(raw);

    if (!data.slug) {
      data.slug = file.replace('.md', '');
    }

    posts.push({
      title: data.title || '',
      slug: data.slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      coverImage: data.coverImage || '',
      category: data.category || '',
      author: data.author || '',
      published: data.published !== false,
      file: file,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log(`Blog index built: ${posts.length} posts (${posts.filter(p => p.published).length} published)`);
}

buildBlogIndex();
