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
  Center,
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
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { IconAsterisk } from "@tabler/icons-react";
export const MAX_NB_IMAGES = 6;
export const ImagesZoneDeals = ({
  pictures,
  main_pic,
  setMain_pic,
  images,
  setImages,
  onChange,
}) => {
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
  const [carouselImages, setCarouselImages] = useState<any>([]);
  const {
    data: data,
    errorMessage: errorMessage,
    succeeded: succeeded,
    isLoading: isLoading,
    executeGet: executeGet,
  } = useAxiosGet(BUILD_API("images/get-upload-data"), { nb_images: nbImages });
  const isDropBusy = () => isLoading || busy1 || uploading;
  const init_images = () => {
    if (images && images.length == MAX_NB_IMAGES) return;
    let imgs: any = [];
    for (let i = 0; i < MAX_NB_IMAGES; i++) imgs.push({});
    setImages(imgs);
  };
  useEffect(() => {
    setBusy1(true);
    let pics = pictures;
    let imgs = [...images];
    for (let i = 0; i < pics.length; i++) {
      for (let j = 0; j < imgs.length; j++) {
        if (!imgs[j].image_upload_data) {
          imgs[j].image_upload_data = { id: pics[i] };
          imgs[j].uploading = false;
          imgs[j].src = `${CLOUDFARE_IMAGE_URL1}${pics[i]}/public`;
          imgs[j].error = false;
          imgs[j].progress = 0;
          imgs[j].uploaded = true;
          break;
        }
      }
    }
    setImages(imgs);
    setBusy1(false);
  }, [pictures]);

  useEffect(() => {
    let errorMsg = errorMessage;
    if (errorMsg) error(errorMsg);
    if (succeeded && data && data.images_upload_data) {
      setBusy1(true);
      let images_upload_data = data.images_upload_data;
      let imgs = [...images];
      for (let i = 0; i < images_upload_data.length; i++) {
        for (let j = 0; j < imgs.length; j++) {
          if (imgs[j].file && imgs[j].file.name && !imgs[j].image_upload_data) {
            imgs[j].image_upload_data = images_upload_data[i];
            imgs[j].uploading = true;
            imgs[
              j
            ].src = `${CLOUDFARE_IMAGE_URL1}${images_upload_data[i].id}/public`;
            imgs[j].error = false;
            break;
          }
        }
      }
      setImages(imgs);
      setBusy1(false);
      uploadImages();
    }
  }, [errorMessage, succeeded]);
  const fileInputRef: any = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef && fileInputRef.current && fileInputRef.current.click) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    let files = event.target.files;
    setFilesToUpload(files);
  };

  const startUploading = () => {
    let file_added = 0;
    let imgs = images;
    for (let i = 0; i < filesToUpload.length; i++) {
      if (file_added >= MAX_NB_IMAGES) break;
      for (let j = 0; j < imgs.length; j++) {
        if (!imgs[j].uploaded && !imgs[j].file) {
          imgs[j].file = filesToUpload[i];
          file_added++;
          break;
        }
      }
      setImages(imgs);
    }
    if (file_added < filesToUpload.length) {
      console.log("ERROR max images cannot be more than 6.");
    }
    console.log(images);
    if (file_added > 0) {
      setNbImages(file_added);
      executeGet();
    }
  };
  useEffect(() => {
    let files = filesToUpload;
    if (!files || files.length <= 0) return;
    let imgs = images;
    let nb_uploaded_imgs = 0;
    for (let j = 0; j < imgs.length; j++) {
      if (!imgs[j].uploaded && !imgs[j].file) {
        nb_uploaded_imgs++;
      }
    }

    if (files.length + nb_uploaded_imgs >= MAX_NB_IMAGES) {
      setNewImagesCount(MAX_NB_IMAGES - nb_uploaded_imgs);
      openErrorMaxImg();
    } else startUploading();
  }, [filesToUpload]);
  const uploadImages = async () => {
    setUploading(true);
    const uploadPromises = images.map((img) => {
      if (
        !img.uploading ||
        !img.image_upload_data ||
        !img.image_upload_data.uploadURL ||
        img.uploaded
      )
        return null;

      const formData = new FormData();
      formData.append("file", img.file, img.file.name);
      return axios
        .post(img.image_upload_data.uploadURL, formData, {
          headers: {
            Authorization: `Bearer ${data.batch_token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let progress = 0;
            if (progressEvent.total) {
              progress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
            }

            setImages((prevData) =>
              prevData.map((item) => {
                if (
                  item.image_upload_data &&
                  item.image_upload_data.uploadURL ===
                    img.image_upload_data.uploadURL
                ) {
                  return { ...item, progress };
                }
                return item;
              })
            );
          },
          transformRequest: [(data) => data],
        })
        .then(() => {
          console.log(`${img.file.name} upload successful`);
          if (onChange) {
            onChange();
          }
          setImages((prevData) =>
            prevData.map((item) => {
              if (
                item.image_upload_data &&
                item.image_upload_data.uploadURL ===
                  img.image_upload_data.uploadURL
              ) {
                return {
                  ...item,
                  progress: 0,
                  uploaded: true,
                  uploading: false,
                  error: false,
                };
              }
              return item;
            })
          );
        })
        .catch((error) => {
          console.error(`Error uploading ${img.file.name}:`, error);
          setImages((prevData) =>
            prevData.map((item) => {
              if (
                item.image_upload_data &&
                item.image_upload_data.uploadURL ===
                  img.image_upload_data.uploadURL
              ) {
                return {
                  ...item,
                  progress: 0,
                  image_upload_data: null,
                  uploading: null,
                  src: null,
                  error: true,
                };
              }
              return item;
            })
          );
        });
    });

    await Promise.all(uploadPromises.filter(Boolean));
    setUploading(false);
  };
  return (
    <>
      <DealPopUpImageCarousel
        t={t}
        images={carouselImages}
        openOnImageId={openOnSlidOnImgId}
        openStamp={openStamp}
      />
      <ErrorNumberImagesExceeded
        t={t}
        new_image={newImagesCount}
        max={MAX_NB_IMAGES}
        opened={opened}
        open={openErrorMaxImg}
        close={closeErrorMaxImg}
        onConfirm={() => {
          startUploading();
        }}
      />
      <Card withBorder p={0} style={{ position: "relative" }}>
        <SimpleGrid
          cols={small ? 1 : 2}
          spacing={0}
          style={{ position: "relative" }}
        >
          {!isDropBusy() && (
            <Stack
              h={"200px"}
              justify="center"
              align="center"
              gap={0}
              p="md"
              pr="0px"
              mr="0px"
              style={{ position: "relative" }}
              onClick={handleUploadClick}
              className={`${classesG.dropImagesZone}`}
            >
              <IconCloudUpload
                style={{ width: rem(50), height: rem(50) }}
                stroke={1.5}
              />
              <Box>{t("upload_images", "Upload Images")}</Box>
              <Group>
                {t("maximum", "Maximum")} {MAX_NB_IMAGES}{" "}
                {t("images", "images")}
              </Group>
            </Stack>
          )}
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
              <Box>{t("processin", "Processin")}</Box>
            </Stack>
          )}
          <Box h={"200px"} p="0" style={{ position: "relative" }}>
            {images && images.length > 0 && (
              <SimpleGrid cols={3} spacing={3} style={{ position: "relative" }}>
                {images.map((img, idx) => {
                  return (
                    <>
                      <DropImage
                        openCarousel={() => {
                          setOpenOnSlidOnImgId(img?.image_upload_data?.id);
                          if (!images) {
                            setCarouselImages([]);
                          } else {
                            let imgs: any = [];
                            for (let i = 0; i < images.length; i++)
                              if (
                                images[i].image_upload_data &&
                                images[i].image_upload_data.id &&
                                images[i].image_upload_data.id != ""
                              )
                                imgs.push({
                                  id: images[i].image_upload_data.id,
                                  src: images[i].src,
                                });
                            setCarouselImages(imgs);
                          }
                          if (
                            img?.image_upload_data?.id &&
                            img?.image_upload_data?.id != ""
                          )
                            setOpenStamp(new Date().getTime().toString());
                        }}
                        key={img?.image_upload_data?.id || idx}
                        img={img}
                        t={t}
                        classesG={classesG}
                        main_pic={main_pic}
                        tryAgain={() => {
                          executeGet();
                        }}
                        onClear={() => {
                          setImages((prevData) =>
                            prevData.map((item) => {
                              if (
                                item.image_upload_data &&
                                img &&
                                img.image_upload_data &&
                                item.image_upload_data.id ===
                                  img.image_upload_data.id
                              )
                                return {};
                              else return item;
                            })
                          );
                        }}
                        setMain_pic={() => {
                          if (onChange) onChange();
                          if (
                            img &&
                            img.image_upload_data &&
                            img.image_upload_data.id
                          )
                            setMain_pic(img.image_upload_data.id);
                          else setMain_pic(null);
                        }}
                      />
                    </>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        </SimpleGrid>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".png, .gif, .jpeg, .jpg, .webp, .svg"
          multiple
        />
      </Card>
      <Group justify="left" gap={0} mb="0" mt={3} p={0}>
        <Box c="violet">
          <IconAsterisk size={20} />
        </Box>
        <Text p={0} mt={-5} fz="xs">
          {t(
            "select_default_pic_that_will_show_in_the_trad_flor_lst",
            "Adding pictures is optional, but including them enhances the deal."
          )}
        </Text>
      </Group>
      <Group justify="left" gap={0} mt={-5} mb={3}>
        <Box c="violet">
          <IconSquare size={20} />
        </Box>
        <Text p={0} mt={-5} fz="xs">
          {t(
            "select_default_pic_that_will_show_in_the_trad_flor_lst",
            "Please select the default picture to display in the trading floor list."
          )}
        </Text>
      </Group>
    </>
  );
};
const DropImage = ({
  img,
  classesG,
  t,
  onClear,
  main_pic,
  setMain_pic,
  tryAgain,
  openCarousel,
}) => {
  const img_is_ok = () => {
    return img && !img.error && img.src && img.src != "" && !img.uploading;
  };
  const is_main_pic = () => {
    return (
      img &&
      img.image_upload_data &&
      img.image_upload_data.id &&
      img.image_upload_data.id == main_pic
    );
  };

  return (
    <>
      {img && img.uploading && img.progress && (
        <Stack
          h={100}
          justify="center"
          className={`${classesG.dropImageProgress}`}
        >
          <Progress value={img.progress} />
          <Group justify="center">{t("uploading", "Uploading..")}</Group>
        </Stack>
      )}
      {!(img && img.uploading && img.progress) && (
        <Box
          style={{ position: "relative" }}
          className={`${img_is_ok() ? classesG.dropImage : ""}`}
        >
          {img_is_ok() && (
            <Group
              className={`${classesG.dropImageTool}`}
              gap={2}
              style={{
                position: "absolute",
                right: "0px",
                bottom: "0px",
                padding: "1px",
                zIndex: 190,
                opacity: img_is_ok() ? 1 : 0,
              }}
            >
              {is_main_pic() && (
                <Tooltip label={t("default_image", "Default Image")}>
                  <ActionIcon
                    c="violet"
                    size="md"
                    variant="transparent"
                    onClick={setMain_pic}
                  >
                    <IconSquareCheck />
                  </ActionIcon>
                </Tooltip>
              )}
              {!is_main_pic() && (
                <Tooltip label={t("default_image", "Default Image")}>
                  <ActionIcon
                    c="violet"
                    size="md"
                    variant="transparent"
                    onClick={setMain_pic}
                  >
                    <IconSquare />
                  </ActionIcon>
                </Tooltip>
              )}
              <Box
                w="1px"
                h="20px"
                className={`${classesG.dropImageToolSep}`}
              ></Box>
              <ConfirmImageDelete t={t} onClear={onClear} />
            </Group>
          )}
          <Image
            w={75}
            height={100}
            src={img.src}
            style={{ cursor: !img.error ? "pointer !important" : "default" }}
            onClick={() => {
              if (!img.error) openCarousel();
            }}

            // placeholder={
            //   <Stack
            //     gap={2}
            //     align="center"
            //     style={{ cursor: img.error ? "pointer !important" : "default" }}
            //     onClick={() => {
            //       if (img.error) tryAgain();
            //     }}
            //   >
            //     {!img.error && (
            //       <IconPhoto
            //         style={{ width: rem(30), height: rem(30) }}
            //         stroke={1.5}
            //       />
            //     )}
            //     {!img.error && (
            //       <Text align="center">{t("no_image", "No Image")}</Text>
            //     )}
            //     {img.error && (
            //       <ActionIcon variant="transparent">
            //         {" "}
            //         <IconExclamationMark
            //           style={{ width: rem(30), height: rem(30) }}
            //           stroke={3}
            //           color="red"
            //         />
            //       </ActionIcon>
            //     )}
            //     {img.error && (
            //       <Text align="center">
            //         {t("error_try again", "Error! Try again")}
            //       </Text>
            //     )}
            //   </Stack>
            // }
          />
        </Box>
      )}
    </>
  );
};

function ConfirmImageDelete({ t, onClear }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        withCloseButton={true}
        title={t("delete_confirmation", "Delete Confirmation..")}
      >
        <Text>
          {" "}
          {t(
            "are_you_sure_you_want_to_delete_image_undo_impossible",
            "Are you sure you want to delete this image? This action cannot be undone after saving."
          )}
        </Text>

        <Group mt="xl" justify="right" gap="md">
          <Button variant="light" onClick={close}>
            {t("cancel", "Cancel")}
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              onClear();
              close();
            }}
          >
            {t("yes", "Yes")}
          </Button>
        </Group>
      </Modal>
      <Group justify="center">
        <ActionIcon c="red" size="md" variant="transparent" onClick={open}>
          <IconX />
        </ActionIcon>
      </Group>
    </>
  );
}
const DealPopUpImageCarousel = ({ t, images, openOnImageId, openStamp }) => {
  const small = useSelector(selectSmall);

  const [opened, { close, open }] = useDisclosure(false);
  // const [imagesC, setImagesC] = useState<any>([])
  // useEffect(() => {
  // updateCarousel()
  // }, [images])
  // const updateCarousel = () => {
  //     if (!images) {
  //         setImagesC([])
  //         return
  //     }
  //     let imgs: any = []
  //     for (let i = 0; i < images.length; i++)
  //         if (images[i].image_upload_data && images[i].image_upload_data.id && images[i].image_upload_data.id != '')
  //             imgs.push({
  //                 id: images[i].image_upload_data.id,
  //                 src: images[i].src
  //             })
  //     setImagesC(imgs)
  // }
  const getInitID = () => {
    if (!images) return null;
    let j = 0;
    for (let i = 0; i < images.length; i++) {
      if (images[i].id && images[i].id == openOnImageId) return j;
      j++;
    }

    return j;
  };
  const [defaultSlid, setDefaultSlid] = useState<any>(() => {
    return getInitID();
  });

  useEffect(() => {
    if (!openStamp || openStamp == "") return;
    setDefaultSlid(getInitID());
    open();
  }, [openStamp]);
  // useEffect(() => {
  //     if (!openStamp || openStamp == '')
  //         return
  //     setDefaultSlid(getInitID())
  // }, [openOnImageId])

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
                    {/* <Image mah={"90vh"} fit="scale-down" src={img.src} /> */}
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

const ErrorNumberImagesExceeded = ({
  t,
  max,
  new_image,
  opened,
  open,
  close,
  onConfirm,
}) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={t("error_max_nb_pages_exceeded", "")}
      >
        {t(
          "error_number_imgs_exceeded",
          "Error: Number of images exceeded. Only "
        )}
        {max - new_image}
        {t("images_allowed", " images can be uploaded.")}
        <Group justify="right">
          <Button
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            {t("ok", "Ok")}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export const DealImageCarousel = ({ t, pictures, main_pic }) => {
  const [openOnImageId, setOpenOnImageId] = useState(main_pic);
  const [openStamp, setOpenStamp] = useState("");
  const [images, setImages] = useState<any>([]);
  useEffect(() => {
    let imgs: any = [];
    if (pictures != "") {
      let pics = pictures.split(" ");
      for (let i = 0; i < pics.length; i++) {
        if (pics[i] == main_pic)
          imgs.splice(0, 0, {
            src: `${CLOUDFARE_IMAGE_URL1}${pics[i]}/public`,
            id: pics[i],
          });
        else
          imgs.push({
            src: `${CLOUDFARE_IMAGE_URL1}${pics[i]}/public`,
            id: pics[i],
          });
      }
    }

    setImages(imgs);
  }, [pictures]);

  return (
    <>
      <DealPopUpImageCarousel
        t={t}
        images={images}
        openOnImageId={openOnImageId}
        openStamp={openStamp}
      />
      {!images ||
        (images.length <= 0 && (
          <Center h="100%">
            <Text fz="1.5rem">
              {t(
                "no_image_to_show",
                "No images linked to this deal. Kindly add more photos if you can."
              )}
            </Text>
          </Center>
        ))}
      {images && images.length > 0 && (
        <Carousel
          loop={true}
          nextControlIcon={<IconArrowRight size={25} stroke={2.5} />}
          previousControlIcon={<IconArrowLeft size={25} stroke={2.5} />}
          withIndicators
          slideGap="md"
          align="start"
          dragFree
          controlSize={40}
          initialSlide={0}
        >
          {images.map((img) => {
            return (
              <Carousel.Slide
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* <Image mah={"90vh"} fit="scale-down" src={img.src} /> */}
                <img
                  src={img.src}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "scale-down",
                    objectPosition: "top",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenOnImageId(img.id);
                    setOpenStamp(new Date().getTime().toString());
                  }}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      )}
    </>
  );
};
