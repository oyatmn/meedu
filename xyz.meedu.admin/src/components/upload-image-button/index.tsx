import { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  Image,
  Empty,
  message,
  Pagination,
} from "antd";
import { media } from "../../api";
import styles from "./index.module.scss";
import { UploadImageSub } from "./upload-image-sub";
import selectedIcon from "../../assets/home/selected.png";
import { PerButton } from "../permission-button";

interface Option {
  id: string | number;
  name: string;
  children?: Option[];
}

interface ImageItem {
  id: number;
  category_id: number;
  name: string;
  extension: string;
  size: number;
  disk: string;
  file_id: string;
  path: string;
  url: string;
  created_at: string;
}

interface PropsInterface {
  text: any;
  scene: string;
  onSelected: (url: string) => void;
}

export const UploadImageButton = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);

  const [scene, setScene] = useState("");
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const fromRows = [
    { key: "", name: "全部图片" },
    {
      key: "cover",
      name: "课程封面",
    },
    {
      key: "avatar",
      name: "学员头像",
    },
    {
      key: "config",
      name: "系统配置",
    },
    {
      key: "editor",
      name: "文本编辑器",
    },
    {
      key: "decoration",
      name: "装修",
    },
    {
      key: "other",
      name: "其它",
    },
  ];

  useEffect(() => {
    setScene(props.scene);
  }, [props.scene]);

  // 获取图片列表
  const getImageList = () => {
    media
      .imageList({ page: page, size: size, scene: scene })
      .then((res: any) => {
        setTotal(res.data.total);
        setImageList(res.data.data);
      })
      .catch((err) => {
        console.log("错误,", err);
      });
  };
  // 重置列表
  const resetImageList = () => {
    setPage(1);
    setImageList([]);
    setRefresh(!refresh);
  };

  // 加载图片列表
  useEffect(() => {
    if (showModal) {
      getImageList();
    }
  }, [scene, refresh, page, size, showModal]);

  return (
    <>
      <PerButton
        type="primary"
        text={props.text ? props.text : "上传图片"}
        class=""
        icon={null}
        p="media.image.index"
        onClick={() => setShowModal(true)}
        disabled={null}
      />

      {showModal ? (
        <Modal
          title="选择图片"
          closable={false}
          onCancel={() => {
            setShowModal(false);
          }}
          open={true}
          width={881}
          maskClosable={false}
          onOk={() => {
            if (!selected) {
              message.error("请选择图片后确定");
              return;
            }
            props.onSelected(selected);
            setShowModal(false);
          }}
          centered
        >
          <Row style={{ width: 830, height: 560, marginTop: 24 }}>
            <div
              style={{ position: "absolute", right: 30, top: 15, zIndex: 15 }}
            >
              <UploadImageSub
                scene={scene}
                onUpdate={() => {
                  resetImageList();
                }}
              ></UploadImageSub>
            </div>
            <Col span={5}>
              <div className={styles["category-box"]}>
                {fromRows.map((item: any) => (
                  <div
                    key={item.key}
                    className={
                      item.key === scene
                        ? styles["category-act-item"]
                        : styles["category-item"]
                    }
                    onClick={() => setScene(item.key)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </Col>
            <Col span={19}>
              {imageList.length === 0 && (
                <Col span={24}>
                  <Empty description="暂无图片" />
                </Col>
              )}
              <div className={styles["image-box"]}>
                <div className={styles["image-list-box"]}>
                  {imageList.map((item) => (
                    <div
                      key={item.id}
                      className={
                        selected.indexOf(item.url) !== -1
                          ? styles["image-active-item"]
                          : styles["image-item"]
                      }
                      onClick={() => {
                        setSelected(item.url);
                      }}
                    >
                      {selected.indexOf(item.url) !== -1 && (
                        <div className={styles["sel"]}>
                          <img src={selectedIcon} />
                        </div>
                      )}
                      <div className={styles["image-render"]}>
                        <div
                          className={styles["image-view"]}
                          style={{ backgroundImage: `url(${item.url})` }}
                        ></div>
                      </div>
                      <div className={styles["image-name"]}>
                        <div className={styles["name"]}>{item.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {imageList.length > 0 && (
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    marginTop: 30,
                  }}
                >
                  <Pagination
                    onChange={(currentPage, currentSize) => {
                      setPage(currentPage);
                      setSize(currentSize);
                    }}
                    pageSize={size}
                    defaultCurrent={page}
                    showSizeChanger={false}
                    total={total}
                  />
                </Col>
              )}
            </Col>
          </Row>
        </Modal>
      ) : null}
    </>
  );
};
