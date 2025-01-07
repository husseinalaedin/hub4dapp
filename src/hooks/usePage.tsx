import { Group, Pagination, Select } from "@mantine/core";
import { useWindowEvent, useWindowScroll } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
export const pageSizes = [
  { value: "1", label: "1" },
  { value: "6", label: "6" },
  { value: "10", label: "10" },
  { value: "24", label: "24" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

export const usePage = ({ data }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPage, setTotalPage] = useState<any>(0);
  const [pageSize, setPageSize] = useState<any>(() => {
    let psz = searchParams.get("pagesize");
    return psz && +psz > 1 ? psz : 10;
  });
  const [activePage, setActivePage] = useState<any>(() => {
    let pg = searchParams.get("page");
    return pg && +pg > 1 ? pg : 1;
  });
  useEffect(() => {
    let tot = 0;
    if (data && data.length > 0) tot = Math.ceil(data[0].total_rows / pageSize);
    setTotalPage(tot);
  }, [data]);
  const navigatePage = () => {
    searchParams.set("t", new Date().getTime().toString());
    searchParams.set("src", "page");
    searchParams.set("page", activePage);
    searchParams.set("pagesize", !pageSize || pageSize <= 0 ? 24 : pageSize);
    setSearchParams(searchParams);
    navigate({
      search: searchParams.toString(),
    });
  };
  return {
    totalPage,
    pageSize,
    activePage,
    setTotalPage,
    setPageSize,
    setActivePage,
    navigatePage,
  };
};
export const Pages = ({ data, small }) => {
  const [refresh, setRefresh] = useState(0);
  const {
    totalPage,
    pageSize,
    activePage,
    setTotalPage,
    setPageSize,
    setActivePage,
    navigatePage,
  } = usePage({ data });
  useEffect(() => {
    let actv = activePage;
    if (refresh != 0) navigatePage();
  }, [activePage, pageSize, refresh]);
  return (
    <Group justify="space-between">
      <Pagination
        withControls={!small}
        siblings={1}
        size="lg"
        mt="lg"
        value={+activePage}
        total={totalPage}
        onChange={(pg) => {
          setActivePage(pg);
          setRefresh(new Date().getTime());
        }}
      />
      <Select
        size="md"
        mt="lg"
        value={pageSize.toString()}
        style={{ maxWidth: 100 }}
        onChange={(ps) => {
          setActivePage(1);
          setPageSize(ps);
          setRefresh(new Date().getTime());
        }}
        data={pageSizes}
      ></Select>
    </Group>
  );
};

export const useOnLoadPage = ({ page_size }) => {
  let [isLoading, setIsLoading] = useState(false);
  const [totalPageInitiated, setTotalPageInitiated] = useState<any>(false);
  const [allPagesLoaded, setAllPagesLoaded] = useState<any>(false);
  const [totalPage, setTotalPage0] = useState<any>(0);
  const [pageSize, setPageSize] = useState<any>(page_size);
  const [activePage, setActivePage] = useState<any>(1);

  const [extraInfo, setExtraInfo] = useState<any>({});
  const nextPage = () => {
    if (activePage < totalPage) {
      setIsLoading(true);
      setActivePage(activePage + 1);
      return true;
    }
    setIsLoading(false);
    return false;
  };
  const pageCanceled = () => {
    if (isLoading) {
      setIsLoading(false);
      if (activePage - 1 >= 1) setActivePage(activePage - 1);
    }
  };
  const setTotalPage = (data) => {
    if (totalPageInitiated) return;
    let tot = 0;
    if (data && data.length > 0) tot = Math.ceil(data[0].total_rows / pageSize);
    setTotalPage0(tot);
    setTotalPageInitiated(true);
  };
  useEffect(() => {
    setAllPagesLoaded(() => {
      if (!totalPageInitiated) return false;
      return activePage >= totalPage;
    });
  }, [totalPageInitiated, activePage]);
  const initPage = () => {
    setTotalPageInitiated(false);
    setAllPagesLoaded(false);
    setIsLoading(false);
    setActivePage(1);
    setTotalPage0(0);
    setExtraInfo({});
  };
  const allPagesLoadedCheck = () => {
    return allPagesLoaded && !isLoading;
  };
  return {
    totalPage,
    pageSize,
    activePage,
    setTotalPage,
    setPageSize,
    setActivePage,
    nextPage,
    isLoading,
    setIsLoading,
    allPagesLoadedCheck,
    initPage,
    pageCanceled,
    extraInfo,
    setExtraInfo,
  };
};
// export const useScrollPage = (onNextPage, isLoading0) => {
//     let [isLoading, setIsLoading] = useState(false)
//     const [scroll] = useWindowScroll();
//     useWindowEvent('scroll', () => {
//         let isMounted = true;
//         let top = document.documentElement.scrollTop
//         if (scroll.y != 0 || scroll.x != 0) {
//             let i = 0;
//             i++;
//         }
//         try {
//             console.log(top, isLoading)
//             if (top == 0 && onNextPage && !isLoading) {
//                 setIsLoading(true)
//                 onNextPage()
//             }
//         } catch (error) {

//         }
//         finally {

//         }

//         const cleanUp = () => {
//             isMounted = false;
//         }
//         return cleanUp;
//     });
//     return { onNextPage, scroll, setIsLoading, isLoading }
// }
