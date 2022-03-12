import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html"

const pastsDirectory = path.join(process.cwd(),"posts")

//mdファイルのデータを取り出す関数
export function getPostsData() {
    const fileNames = fs.readdirSync(pastsDirectory); //拡張子付きのファイル名を取得
    const allPostsData = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, ""); //ファイルの拡張子を取り除く
      
      //マークダウンファイルを文字列で取り出す。
      const fullPath = path.join(pastsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      //idとデータを返す
      return {
        id,
        ...matterResult.data,
      }
    });
    return allPostsData
}

//getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(pastsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, "")
      }
    }
  })
}

//Idに基づいてブログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(pastsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath,"utf8");

  const matterResult = matter(fileContent);

  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHTML = blogContent.toString();
  
  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  }
}