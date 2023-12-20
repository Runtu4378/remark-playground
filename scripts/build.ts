import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

import { remark } from 'remark';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

import remarkEmbedImages from './remarkEmbedImages.js';

const MARKDOWN_DIR = path.join(process.cwd(), 'examples');

const paths = globSync(path.join(MARKDOWN_DIR, '/*.md'));

paths.forEach(async (mdPath) => {
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  const result = await remark()
    // .use(remarkBreaks)
    .use(remarkGfm)

    .use(remarkEmbedImages, { path: '11' })

    // 开始转为 HTML 树
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeRaw)

    // 添加标题锚点
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)

    // 格式化输出的字符串，使可读性更强
    .use(rehypeFormat)
    .use(rehypeStringify, {
      omitOptionalTags: true,
    })
    .process(mdContent);

  const mdFileName = path
    .basename(mdPath)
    .replace(path.extname(mdPath), '.html');
  const htmlPath = path.join(path.dirname(mdPath), mdFileName);

  fs.writeFileSync(htmlPath, result.toString(), 'utf8');
});
