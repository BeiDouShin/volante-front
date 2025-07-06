"use client"; // ← 必ず最上部に書く

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


type MicroBlog = {
  id: number;
  branchNo: number;
  postContent: string;
  ownerUserId: number;
  createAt: string;
  createUserId: number;
};

const MicroBlogList: React.FC = () =>  {
  const [blogs,setBlogs] = useState<MicroBlog[]>([])
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch("http://localhost:8080/api/micro-blog")
      .then((res) => {
        if(!res.ok){
          throw new Error(`HTTPエラー: ${res.status}`);
        }
        return res.json();
      })
      .then((data: MicroBlog[]) => {
        setBlogs(data);
      })
      .catch((err) => {
        console.error("APIエラー:",err);
        setError("データ取得中にエラーが発生しました。")
      })
  }, []);

  return (
    <div>
      <h1>Welcome to VolanteMicroBlog</h1>

      <h2>最近の投稿</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="投稿を検索"
        />
        <button type="submit" className="btn btn-primary">
        検索
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {blogs.length === 0 && !error && <p>読み込み中...</p>}

      <Container className="mt-4">
        <Row className="justify-content-center">
          {blogs.map((blog) => (
            <Col key={blog.id} xs={12}>
              <Card className="h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{blog.postContent}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    投稿者ID: {blog.ownerUserId}
                  </h6>
                  <h6 className="card-subtitle mb-2 text-muted">
                   {blog.createAt}
                  </h6>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

  </div>
  );
};

export default MicroBlogList;

/*export default function Home() {
  //サンプル値
  const blogs: MicroBlog[] = [
    {
      id: 1,
      branchNo: 1,
      postContent: "おまたんです！",
      ownerUserId: 101,
      createAt: "2025-06-22T12:00:00",
      createUserId: 101,
    },
        {
      id: 2,
      branchNo: 1,
      postContent: "おまたんは不審者を通報しました💪",
      ownerUserId: 101,
      createAt: "2025-06-22T12:00:00",
      createUserId: 101,
    }
  ];

  return (
    <div>
      <MicroBlogList blogs={blogs} />
    </div>
  );
}*/