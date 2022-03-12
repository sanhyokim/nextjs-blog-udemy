import Head from 'next/head'
import react from "react";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from '../../styles/utils.module.css'

export async function getStaticPaths() {
  const paths = getAllPostIds();

  return {
    paths,
    fallback: false, //存在しないIDが出ると404になる
  }
}

export async function getStaticProps({ params }) {
  const pastData = await getPostData(params.id);

  return {
    props: {
      pastData,
    },
  }
}


export default function Post( {pastData}) {
  return (
    <Layout>
      <Head>
        <title>
          {pastData.title}
        </title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{pastData.title}</h1>
        <div className={utilStyles.lightText}>{pastData.date}</div>

        <div dangerouslySetInnerHTML={{__html: pastData.blogContentHTML}} />  
      </article>
    </Layout>
  );
}

//注　dangerouslySetInnerHTMLを使用する場合はサニタイズが必要（他人が書いたHTML付きの文章は裏にプログラミングが記載されている可能性があるため