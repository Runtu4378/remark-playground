import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const MARKDOWN_DIR = path.join(process.cwd(), 'examples');

const paths = globSync(path.join(MARKDOWN_DIR, '/*.md'));

paths.forEach(async (mdPath) => {
  const mdContent = fs.readFileSync(mdPath, 'utf8');

  const result = await remark()
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(mdContent);

  const mdFileName = path.basename(mdPath).replace(path.extname(mdPath), '');
  const htmlPath = path.join(path.dirname(mdPath), mdFileName);
  fs.writeFileSync(htmlPath, result.toString(), 'utf8');
});
