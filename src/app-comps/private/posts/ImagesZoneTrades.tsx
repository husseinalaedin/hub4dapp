import { useTranslation } from "react-i18next";
import { useGlobalStyl } from "../../../hooks/useTheme";
import { BUILD_API, CLOUDFARE_IMAGE_URL1, useMessage } from "../../../global/G";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectMedium,
  selectSmall,
} from "../../../store/features/ScreenStatus";
import { useDisclosure } from "@mantine/hooks";
import { useAxiosGet } from "../../../hooks/Https";
import axios from "axios";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Image,
  Loader,
  Modal,
  Progress,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCloudUpload,
  IconExclamationMark,
  IconPhoto,
  IconSquare,
  IconSquareCheck,
  IconX,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { ImageWithAspectRatio } from "./Trades";
export const GENERIC_TRADE_IMAGE = "5544d93d-140b-4b21-9191-f8ae597d9a00";
export const ImagesZoneTrades = ({ pictures }) => {
  const [images, setImages] = useState<any>([]);
  const { t } = useTranslation("private", { keyPrefix: "deals" });
  const { classes: classesG } = useGlobalStyl();
  const { error, succeed, info } = useMessage();
  const [nbImages, setNbImages] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [busy1, setBusy1] = useState(false);

  const [openStamp, setOpenStamp] = useState("");
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [opened, { open: openErrorMaxImg, close: closeErrorMaxImg }] =
    useDisclosure(false);
  const [newImagesCount, setNewImagesCount] = useState(0);
  const [filesToUpload, setFilesToUpload] = useState<any>();
  const [openOnSlidOnImgId, setOpenOnSlidOnImgId] = useState("");
  const isDropBusy = () => busy1 || uploading;

  useEffect(() => {
    if (!(pictures && pictures != "")) return;
    setBusy1(true);
    let pics = pictures.split(" ");
    let imgs: any = [];
    for (let i = 0; i < pics.length; i++) {
      imgs.push({
        id: pics[i],
        src: `${CLOUDFARE_IMAGE_URL1}${pics[i]}/public`,
      });
    }
    setImages(imgs);
    setBusy1(false);
  }, [pictures]);

  const fileInputRef: any = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef && fileInputRef.current && fileInputRef.current.click) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <TradePopUpImageCarousel
        t={t}
        images={images}
        defaultid={openOnSlidOnImgId}
        openStamp={openStamp}
      />

      <Card withBorder p={0} style={{ position: "relative" }}>
        <SimpleGrid cols={1} spacing={0} style={{ position: "relative" }}>
          {/* {!isDropBusy() && <Stack h={"200px"} justify="center" align="center" gap={0} p="md" pr="0px" mr="0px" style={{ position: "relative" }}
                        onClick={handleUploadClick}
                        className={`${classesG.dropImagesZone}`} >

                        <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                        <Box>{t('upload_images', 'Upload Images')}</Box>
                        <Group>{t('maximum', 'Maximum')} {MAX_NB_IMAGES} {t('images', 'images')}</Group>
                    </Stack>
                    }
                    {isDropBusy() && <Stack h={"200px"} justify="center" align="center" gap={0} p="md" pr="0px" mr="0px" style={{ position: "relative" }}

                        className={`${classesG.dropImagesZone}`} >
                        <Loader />
                        <Box>{t('processin', 'Processin')}</Box>
                    </Stack>
                    } */}
          <Box mah={"100px"} p="0" style={{ position: "relative" }}>
            {isDropBusy() && (
              <Stack
                h={"200px"}
                justify="center"
                align="center"
                gap={0}
                p="md"
                pr="0px"
                mr="0px"
                style={{ position: "relative" }}
                className={`${classesG.dropImagesZone}`}
              >
                <Loader />
                <Box>{t("loading", "Loading")}</Box>
              </Stack>
            )}
            {images && images.length > 0 && (
              <SimpleGrid cols={6} spacing={3} style={{ position: "relative" }}>
                {images.map((img, idx) => {
                  return (
                    <>
                      <DropImage
                        openCarousel={() => {
                          setOpenOnSlidOnImgId(img?.id);
                          setOpenStamp(new Date().getTime().toString());
                        }}
                        key={img?.id || idx}
                        img={img}
                        t={t}
                        classesG={classesG}
                      />
                    </>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        </SimpleGrid>
      </Card>
    </>
  );
};
const DropImage = ({ img, classesG, t, openCarousel }) => {
  return (
    <Box style={{ position: "relative" }} className={`${classesG.dropImage}`}>
      {/* <Image w={75} height={100} src={img.src}
                style={{ cursor: !img.error ? "pointer !important" : "default" }}
                onClick={() => {
                    openCarousel()
                }}
            /> */}

      <ImageWithAspectRatio
        height={70}
        fit={"scale-down"}
        src={img.src}
        alt=""
        onClick={() => {
          openCarousel();
        }}
      />
    </Box>
  );
};

const TradePopUpImageCarousel = ({ t, images, defaultid, openStamp }) => {
  const small = useSelector(selectSmall);
  const { classes: classesG } = useGlobalStyl();
  const [opened, { close, open }] = useDisclosure(false);

  const getInitID = () => {
    if (!images) return null;
    let j = 0;
    for (let i = 0; i < images.length; i++) {
      if (images[i].id == defaultid) return j;
      j++;
    }

    return 0;
  };
  const [defaultSlid, setDefaultSlid] = useState<any>(() => {
    return getInitID();
  });

  useEffect(() => {
    if (!openStamp || openStamp == "") return;
    setDefaultSlid(getInitID());
    open();
  }, [openStamp]);
  return (
    <>
      <Modal
        fullScreen={small}
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={true}
        yOffset={0}
      >
        <Carousel
          loop={true}
          nextControlIcon={<IconArrowRight size={25} stroke={2.5} />}
          previousControlIcon={<IconArrowLeft size={25} stroke={2.5} />}
          withIndicators
          slideGap="md"
          align="start"
          dragFree
          controlSize={40}
          initialSlide={defaultSlid}
        >
          {images && (
            <>
              {images.map((img) => {
                return (
                  <Carousel.Slide>
                    <img
                      src={img.src}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "90vh",
                        objectFit: "scale-down",
                        objectPosition: "top",
                      }}
                    />
                  </Carousel.Slide>
                );
              })}
            </>
          )}
        </Carousel>
      </Modal>
    </>
  );
};
