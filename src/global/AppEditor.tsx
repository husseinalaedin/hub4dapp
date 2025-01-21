import {
  RichTextEditor,
  Link as LinkTip,
  useRichTextEditorContext,
} from "@mantine/tiptap";
import {
  BubbleMenu,
  FloatingMenu,
  useEditor,
  mergeAttributes,
} from "@tiptap/react";

import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Extension, Node, NodePos } from "@tiptap/core";

// import "@tiptap/extension-text-style";
import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconArrowsJoin2,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconArrowsSplit2,
  IconBaselineDensitySmall,
  IconBrightness,
  IconBrightnessUp,
  IconCheckbox,
  IconCircleFilled,
  IconCircleOff,
  IconColorPicker,
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconColumnRemove,
  IconCopy,
  IconEyeTable,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHeading,
  IconHome,
  IconLineHeight,
  IconMoodSmile,
  IconMoon2,
  IconPaintFilled,
  IconPalette,
  IconQuestionMark,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconRowRemove,
  IconSearch,
  IconSphere,
  IconTableMinus,
  IconTableOff,
  IconTableOptions,
  IconTablePlus,
  IconTextSize,
  IconX,
} from "@tabler/icons-react";

import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

import React, {
  createContext,
  forwardRef,
  memo,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editor } from "@tinymce/tinymce-react";

import { type TinyMCE as TinyMCEGlobal } from "tinymce";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  ColorInput,
  ColorPicker,
  DEFAULT_THEME,
  Group,
  Loader,
  LoadingOverlay,
  MantineProvider,
  Menu,
  Overlay,
  Paper,
  Popover,
  ScrollArea,
  SegmentedControl,
  Select,
  SimpleGrid,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconCheck, IconStar, IconSwitchHorizontal } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { ThemeContext, useAppTheme } from "../hooks/useAppTheme";
import { APP_URL } from "./G";
import { selectMedium, selectSmall } from "../store/features/ScreenStatus";
import { useSelector } from "react-redux";
import { useClipBoarHtml } from "../hooks/useClipboard";
import {
  useClickOutside,
  useDebouncedState,
  useDebouncedValue,
  useElementSize,
  useFullscreen,
  useIntersection,
  useScrollIntoView,
} from "@mantine/hooks";
import { Table as Table0 } from "@mantine/core";
import Paragraph from "@tiptap/extension-paragraph";
import { IconMoon } from "@tabler/icons-react";
import { useEmoji } from "../hooks/useEmoji";
import { UseThemeSave, useGlobalStyl } from "../hooks/useTheme";

import { IconChecks } from "@tabler/icons-react";
import { convertTablesToCSV, parseContent } from "./Convert";

const ColorContrlPurpoese = {
  BACK: "backgroundcolor",
  TEXT: "textcolor",
};

const getTinymce = (view: Window): TinyMCEGlobal | null => {
  const global = view as any;

  return global && global.tinymce ? global.tinymce : null;
};

export { getTinymce };
export const AppEditorObsolote = ({
  content,
  onChange,
  edit,
  left,
  right,
  extra,
}) => {
  const url = APP_URL + "tinymce/tinymce.min.js";
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  let { theme } = useAppTheme();
  const [currentContent, setCurrentContent] = useState<any>(content);
  const [currentEditingContent, setCurrentEditingContent] =
    useState<any>(content);
  const [show, setShow] = useState<boolean>(true);
  const [show2, setShow2] = useState<boolean>(false);
  const small = useSelector(selectSmall);
  let [toggleTheme, setToggleTheme] = useState("INIT");
  const [iniTiated, setInitiated] = useState(false);
  const [editorTheme, setEditorTheme] = useState(theme);
  const [copying, setCopying] = useState(false);
  const [body, setBody] = useState<string>(() => {
    if (theme == "dark" || theme == "dim") {
      let color = "#1d1e30";
      if (theme == "dark") color = "#1A1B1E";
      return (
        `body { background-color:` +
        color +
        `;font-family:Helvetica,Arial,sans-serif; font-size:14pt }`
      );
    } else {
      return "body { font-family:Helvetica,Arial,sans-serif; font-size:14pt }";
    }
  });
  const [editorSkin, setEditorSkin] = useState<any>(() => {
    if (theme == "dark" || theme == "dim") {
      return "tinymce-5-dark";
    } else {
      return null;
    }
  });
  const [editorContent_css, setEditorContent_css] = useState<any>(() => {
    if (theme == "dark" || theme == "dim") {
      return "dark";
    } else {
      return null;
    }
  });
  const editorRef = useRef<any>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const getContent = () => {
    if (editorRef.current) {
      return editorRef.current.getContent();
    }
    return "";
  };
  useEffect(() => {
    setCurrentContent(content);
  }, [content, edit]);
  useEffect(() => {
    if (extra?.copy && extra?.copy != "") copy();
  }, [extra?.copy]);
  useEffect(() => {
    if (editorTheme == "dark" || editorTheme == "dim") {
      setEditorSkin("tinymce-5-dark"); //
      setEditorContent_css("dark");
      let color = "#1d1e30";
      if (editorTheme == "dark") color = "#1A1B1E";
      setBody(
        `body { background-color:` +
          color +
          `;font-family:Helvetica,Arial,sans-serif; font-size:14pt; line-height: 1;} `
      );
    } else {
      setEditorSkin(null);
      setEditorContent_css(null);
      setBody(
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14pt ;line-height: 1;}"
      );
    }

    let cont = getContent();
    if (cont != "") setCurrentContent(cont);
    if (!show) setShow(true);
  }, [editorTheme]);
  useEffect(() => {
    if (editorTheme == "dark" || editorTheme == "dim") setEditorTheme("");
    else setEditorTheme("dark");
  }, [toggleTheme]);
  useEffect(() => {
    setEditorTheme(theme);
  }, [theme]);

  const copy = () => {
    try {
      if (editorRef && editorRef.current) {
        setCopying(true);
        let timr = setTimeout(() => {
          setCopying(false);
        }, 750);
        // clearTimeout(timr)
        editorRef.current.execCommand("selectAll", true, "id_text");
        editorRef.current.execCommand("copy", true, "id_text");
      }
    } catch (error) {}
  };
  return (
    <>
      {/* <Button onClick={()=>{
                if (editorRef && editorRef.current){
                    editorRef.current.execCommand('selectAll', true, 'id_text');
                    editorRef.current.execCommand('copy', true, 'id_text');
                }
        }}>
            Copy
        </Button> */}
      <Group justify="space-between" mb={2}>
        {left && <Group justify="left">{left}</Group>}
        <Box></Box>
        <Group justify="right">
          {right}

          {extra && extra.withcopy && (
            <Button
              variant="default"
              size="xs"
              type="button"
              onClick={() => {
                copy();
              }}
            >
              <Group justify="space-between">
                <Box c={copying ? "blue" : ""}>
                  {!copying && <IconCopy size={24} />}
                  {copying && <IconCheck size={24} />}
                </Box>
              </Group>
            </Button>
          )}
        </Group>
      </Group>

      <div style={{ minHeight: 500, marginBottom: 20 }}>
        {
          <Box pos="relative">
            <LoadingOverlay
              // loader={<Loader variant="oval" />}

              visible={!show2}
              overlayProps={{ radius: "sm", blur: 2 }}
              opacity={1}
            />
            {/* {!show2 && <Overlay color="#000" opacity={0.85} />} */}
            <Box>
              {show && (
                <Editor
                  tinymceScriptSrc={url}
                  // apiKey='ts9klhjufdhob57tc44mzyvh7gh43w9uabxahdwogsli3z02'
                  onChange={() => {
                    let content0 = getContent();
                    setCurrentEditingContent(content0);
                    if (onChange) {
                      onChange(content0);
                    }
                  }}
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                    setShow2(true);
                  }}
                  // toolbar: 'lineheight',
                  // line_height_formats: '1 1.2 1.4 1.6 2'
                  initialValue={currentContent}
                  init={{
                    // block_formats: 'Paragraph=span; Header 1=h1; Header 2=h2; Header 3=h3',

                    setup: (editor0) => {
                      editor0.on("keydown", (e) => {
                        if (e.key === "Tab") {
                          // Tab key code
                          if (!e.shiftKey) {
                            e.preventDefault();
                            editor0.execCommand("Indent");
                          } else {
                            e.preventDefault();
                            editor0.execCommand("Outdent");
                          }
                        }
                      });
                    },
                    content_style: body,

                    forced_root_block: "div", // Set the root block to 'div'
                    force_br_newlines: true,
                    force_p_newlines: false,

                    branding: false,
                    skin: editorSkin,
                    content_css: editorContent_css,
                    height: 500,
                    menubar: false,
                    line_height_formats: "1 1.2 1.4 1.6 2",
                    plugins: "link fullscreen image table",
                    toolbar: `undo redo | fullscreen link | table lineheight | bold italic fontsize backcolor forecolor | alignleft aligncenter alignright alignjustify | outdent indent | 
                                  styles | fontfamily fontselect | image | bullist numlist
                                  removeformat`,

                    block_unsupported_drop: true,
                  }}
                />
              )}
            </Box>
          </Box>
        }
      </div>
      <Paper p="sm" mb="xs" style={{ borderTop: "1px solid silver" }}>
        <Group style={{ whiteSpace: "nowrap" }} gap={2}>
          <Button
            variant="light"
            size="xs"
            type="button"
            onClick={() => {
              setShow(false);
              setCurrentContent(currentEditingContent);
              setToggleTheme(new Date().getTime().toString());
            }}
          >
            <Group>
              <IconSwitchHorizontal size={18} />
            </Group>
            {/* {t('theme', 'Theme')} */}
          </Button>
          <Box className={classesG.fontNotes}>
            <span style={{ marginTop: 20 }}>
              {t(
                "please_switch_themes",
                "**Please toggle between the dark and light themes to see how the editor content appears in each."
              )}
            </span>
          </Box>
        </Group>
      </Paper>
    </>
  );
};

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      border: {
        default: null,
        renderHTML: (attributes) => {
          return {
            style: `border:1px solid silver`,
          };
        },
      },
    };
  },
});
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      border: {
        default: null,
        // parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: (attributes) => {
          return {
            // 'data-background-color': attributes.backgroundColor,
            style: `border:1px solid silver;`,
          };
        },
      },
      padding: {
        default: null,
        renderHTML: (attributes) => {
          return {
            style: `padding:3px 5px;`,
          };
        },
      },
    };
  },
});

const CustomTable2 = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.style?.cssText,
      },
    };
  },
});

// const ParagraphDiv = Node.create({
//     name: 'paragraphDiv',

//     priority: 2000,

//     defaultOptions: {
//         HTMLAttributes: {},
//     },

//     group: 'block',

//     content: 'inline*',

//     parseHTML() {
//         return [
//             { tag: 'div' },
//         ]
//     },

//     renderHTML({ HTMLAttributes }) {
//         return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
//     },

//     addCommands() {
//         return {
//             setParagraph: () => ({ commands }) => {
//                 return commands.toggleNode('paragraphDiv', 'paragraphDiv')
//             },
//         }
//     },
// });

export const EditorFor = {
  DEAL_ITEM: "DEAL_ITEM",
  ANY: "ANY",
};
export const EditorLabels = ({ label, description }) => {
  const { classes: classesG } = useGlobalStyl();
  return (
    <>
      <Text className={`${classesG.textAsLabel}`}>
        {label}
        <span style={{ color: "red" }}> *</span>{" "}
      </Text>
      <Text size="xs">{description}</Text>
    </>
  );
};

export const useEditorApp = ({ content, isFor, ...others }) => {
  const showThemeToggle =
    others && others.showThemeToggle ? others.showThemeToggle : false;
  let contentI = content; // initContent(content)
  const { classes: classesG } = useGlobalStyl();
  const [savedContent, setSavedContent] = useState(content);
  const [currentContent, setCurrentContent] = useState(content);

  const [contentAsText, setContentAsText] = useState("");
  const [refreshStamp, setRefreshStamp] = useState("");
  const [error, setError] = useState(false);
  const [themePreview, setThemePreview] = useState<any>(null);
  const { ref: refSize, width, height } = useElementSize();
  const { ref, toggle, fullscreen } = useFullscreen();
  let { toggleTheme } = useAppTheme();
  const small = useSelector(selectSmall);
  const medium = useSelector(selectMedium);
  const [enableTableBubbleMenu, setEnableTableBubbleMenu] = useState(true);
  let { postTheme } = UseThemeSave();
  let onPopover = others.onPopover;

  const transformSlice = (slice: any) => {
    slice.content.descendants((node: any) => {
      if (node.attrs.style) {
        let styl = node.attrs.style.replace(/\s/g, "");
        styl = styl.replace(/table-layout:fixed/g, "");
        node.attrs.style = styl;
      }
    });
    return slice;
  };

  const editor = useEditor({
    onBlur({ editor }) {
      setCurrentContent(editor?.getHTML());
    },
    extensions: [
      StarterKit,
      Paragraph.extend({
        parseHTML() {
          return [{ tag: "div" }];
        },
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
          ];
        },
      }),
      Underline,
      LinkTip,
      CustomTable2.configure({
        resizable: true,
      }),
      TableRow,
      CustomTableHeader,
      Highlight,
      TextAlign.configure({ types: ["heading"] }),
      CustomTableCell,
      TextStyle,
      Color,
      BackColorStyle,
      LineHeightStyle,
      FontSizeStyle,
    ],
    editorProps: {
      handlePaste: function (view, event, slice) {
        const transformedSlice = transformSlice(slice);
        view.dispatch(view.state.tr.replaceSelection(transformedSlice));
        return true;
      },
    },
    // content: content
  });
  useEffect(() => {
    setSavedContent(content);
    setCurrentContent(content);
  }, [content]);
  useEffect(() => {
    if (!editor) return;

    editor?.setOptions({ editable: true });
    let cont = parseContent({ content: savedContent });
    editor?.commands.clearContent(true);
    editor?.commands.insertContent(cont.text_n_table, {
      parseOptions: {
        preserveWhitespace: false,
      },
    });
  }, [refreshStamp, editor, savedContent]);

  // let editor: any = {}
  const getThemPreviewClass = () => {
    if (themePreview == "light") return classesG.editorThemeLight;
    if (themePreview == "dark") return classesG.editorThemeDark;
    if (themePreview == "dim") return classesG.editorThemeDim;
    return "";
  };
  const onConfirm = (editor) => {
    setCurrentContent(editor?.getHTML());
  };
  const save = () => {
    setSavedContent(currentContent);
  };
  const edit = () => {
    setCurrentContent(savedContent);
  };
  const cancel = () => {
    setCurrentContent(savedContent);
    refresh();
  };
  const refresh = () => {
    setRefreshStamp(new Date().getTime().toString());
  };
  // const asText = (csv) => {
  //     if (csv)
  //         setContentAsText(convertTablesToCSV({ content: currentContent }))
  //     else
  //         setContentAsText(parseContent({ content: currentContent }).text_n_table)
  // }
  const getContentText = (csv) => {
    if (csv) return convertTablesToCSV({ content: currentContent });
    else return parseContent({ content: currentContent }).text_n_table;
  };
  const editorParseContent = () => {
    return parseContent({ content: currentContent });
  };
  // const memoizedState = useMemo(() => {
  //     return {
  //         editor, error, refSize, ref, setError, save, edit, cancel, asText, contentAsText, savedContent, setCurrentContent, currentContent, refreshStamp, setThemePreview, getThemPreviewClass, toggle,
  //         fullscreen, showThemeToggle, toggleTheme, postTheme, small, medium, onPopover,
  //         enableTableBubbleMenu, setEnableTableBubbleMenu
  //     }
  // }, [content, editor, error, refSize, ref, setError]);
  // return memoizedState

  return {
    editor,
    onConfirm,
    error,
    refSize,
    ref,
    setError,
    save,
    edit,
    cancel,
    contentAsText,
    savedContent,
    setCurrentContent,
    currentContent,
    refreshStamp,
    setThemePreview,
    getThemPreviewClass,
    toggle,
    fullscreen,
    showThemeToggle,
    toggleTheme,
    postTheme,
    small,
    medium,
    onPopover,
    enableTableBubbleMenu,
    setEnableTableBubbleMenu,
    getContentText,
    editorParseContent,
  };
};

export const EditorApp = forwardRef(({ edit, content,...others }: any, ref): any => {
  // const [history, setHistory] = useState<any>([]);
  const [showEditor, setShowEditor] = useState(false);
  let editorObject = useEditorApp({ content: content, isFor: EditorFor.ANY });
  let {onEscape}=others
  let editor = editorObject?.editor;
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("common", { keyPrefix: "tool" });
  useEffect(() => {
    if (editor) {
      // setInitiated(true)
      editor.on("transaction", () => {
        editor?.setOptions({ editable: edit });
      });
    }
  }, [editor, edit]);
  useImperativeHandle(ref, () => ({
    editorObject,
    editor,
  }));
  useEffect(() => {
    if (!edit) setShowEditor(false);
    else {
      let timer = setTimeout(() => {
        setShowEditor(true);
      }, 50);
      return () => clearTimeout(timer);
    }
    
  }, [edit]);
  useEffect(() => {
    try {
      if (editor) editor?.commands.focus();
    } catch (error) {}
  }, [editor]);
   const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if(onEscape)
        onEscape()
    }
  };
  return (
    <>
      {editorObject && (
        <Box ref={editorObject.refSize}>
          <Box ref={editorObject.ref}>
            <RichTextEditor
              editor={editor}
              withTypographyStyles={false}
              className={editorObject.getThemPreviewClass()}
              style={{ border: editorObject.error ? "1px solid red" : "" }}
            >
              {edit && (
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <UndoRedo editor={editor} t={t} />
                  </RichTextEditor.ControlsGroup>
                  {editor && (
                    <BubbleMenu
                      editor={editor}
                      shouldShow={({
                        editor,
                        view,
                        state,
                        oldState,
                        from,
                        to,
                      }) => {
                        // only show the bubble menu for links.
                        return from != to;
                      }}
                    >
                      <RichTextEditor.ControlsGroup
                        style={{ backgroundColor: "black" }}
                      >
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <Colors
                          t={t}
                          purpose={ColorContrlPurpoese.BACK}
                          title={t("background_color", "Background color")}
                          onPopover={editorObject.onPopover}
                        />
                        <Colors
                          t={t}
                          purpose={ColorContrlPurpoese.TEXT}
                          title={t("text_color", "Text color")}
                          onPopover={editorObject.onPopover}
                        />
                      </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                  )}

                  {editor && (
                    <FloatingMenu editor={editor}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.BulletList />
                      </RichTextEditor.ControlsGroup>
                    </FloatingMenu>
                  )}

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />

                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <Copy t={t} editor={editor} />
                    <ThemeToggle
                      t={t}
                      onThemeToggle={(val) => {
                        editorObject.setThemePreview(val);
                      }}
                    />
                    {editor && (
                      <RichTextEditor.Control
                        aria-label={
                          editorObject.fullscreen
                            ? t("exit_fullscreen", "Exit fullscreen")
                            : t("fullscreen", "Fullscreen")
                        }
                        title={
                          editorObject.fullscreen
                            ? t("exit_fullscreen", "Exit fullscreen")
                            : t("fullscreen", "Fullscreen")
                        }
                        onClick={editorObject.toggle}
                      >
                        <Box
                          c={editorObject.fullscreen ? "red" : ""}
                          h="16px"
                          w="16px"
                        >
                          {!editorObject.fullscreen && (
                            <IconArrowsMinimize stroke={1.5} size="1rem" />
                          )}
                          {editorObject.fullscreen && (
                            <IconArrowsMaximize stroke={1.5} size="1rem" />
                          )}
                        </Box>
                      </RichTextEditor.Control>
                    )}
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <Colors
                      t={t}
                      purpose={ColorContrlPurpoese.BACK}
                      title={t("background_color", "Background color")}
                      onPopover={editorObject.onPopover}
                    />
                    <Colors
                      t={t}
                      purpose={ColorContrlPurpoese.TEXT}
                      title={t("text_color", "Text color")}
                      onPopover={editorObject.onPopover}
                    />
                    <RichTextEditor.UnsetColor />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <Heading t={t} />
                    <FontSize t={t} />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <LineHeight t={t} />
                    <TextAlign2 t={t} />
                  </RichTextEditor.ControlsGroup>

                  <TableControl
                    t={t}
                    editor={editor}
                    showCellManip={true}
                    isFor={EditorFor.ANY}
                    editorObject={editorObject}
                  />
                </RichTextEditor.Toolbar>
              )}
              <ScrollArea.Autosize
                mah={
                  !editorObject.fullscreen
                    ? "500px"
                    : editorObject.small || editorObject.medium
                    ? "70vh"
                    : "80vh"
                }
                mih="150px"
                mx="auto"
                mt="0px"
                style={{ overflow: "auto" }}
              >
                <RichTextEditor.Content
                  onKeyDown={handleKeyDown}
                  mt={0}
                  mih={
                    !editorObject.fullscreen
                      ? "150px"
                      : editorObject.small || editorObject.medium
                      ? "70vh"
                      : "80vh"
                  }
                />
              </ScrollArea.Autosize>
            </RichTextEditor>
            {editorObject.showThemeToggle && (
              <Paper p="sm" withBorder mt="2px">
                <Group style={{ whiteSpace: "nowrap" }} gap={2}>
                  <Button
                    variant="light"
                    size="xs"
                    type="button"
                    onClick={() => {
                      editorObject.toggleTheme();
                      editorObject.postTheme();
                    }}
                  >
                    <Group>
                      <IconSwitchHorizontal size={18} />
                    </Group>
                  </Button>
                  <Box className={classesG.fontNotes}>
                    <span style={{ marginTop: 20 }}>
                      {t(
                        "please_switch_themes",
                        "**Please toggle between the dark and light themes to see how the editor content appears in each."
                      )}
                    </span>
                  </Box>
                </Group>
              </Paper>
            )}
          </Box>
        </Box>
      )}
    </>
  );
});
const EditorAppPost = forwardRef(({ edit, content }: any, ref): any => {
  // const [initiated, setInitiated] = useState(false)
  const [showEditor, setShowEditor] = useState(false);
  let editorObject = useEditorApp({
    content: content,
    isFor: EditorFor.DEAL_ITEM,
  });
  let editor = editorObject?.editor;
  const { classes: classesG } = useGlobalStyl();
  const { t } = useTranslation("common", { keyPrefix: "tool" }); 
  useEffect(() => {
    if (editor) {
      // setInitiated(true)
      editor.on("transaction", () => {
        editor?.setOptions({ editable: edit });
        // if (!edit)
        //     editor?.setOptions({ editable: false });
        // else {
        //     let edita = editor ? editor.can().deleteTable() : false
        //     editor?.setOptions({ editable: true });
        // }
      });
    }
  }, [editor, edit]);
  useImperativeHandle(ref, () => ({
    editorObject,
    editor,
  }));

  const countTables = () => {
    if (!editor) return "NO";
    const { $head } = editor.view.state.selection;
    if (!$head) return "NO4";
    // if (myNodePos){
    //     console.log(myNodePos)
    // }
    // // editor.view.state.selection

    // const { selection } = editor.state;
    // const { head } = selection;
    // if (!head || !head.closest)
    //     return 'NO2'
    try {
      const myNodePos = editor.$pos($head.pos);
      if (myNodePos && myNodePos.closest) {
        let before = null;
        let closestTableRow = myNodePos.closest("tableRow");
        // let closestTableCell = myNodePos.closest('tableCell')
        // let closestTableHeader = myNodePos.closest('tableHeader')
        if (
          closestTableRow &&
          closestTableRow.parent &&
          closestTableRow.parent.children
        ) {
          for (let i = 0; i < closestTableRow.parent.children.length; i++) {
            if (
              closestTableRow?.parent?.firstChild?.content ==
              closestTableRow?.content
            )
              return "YES";
          }
        }
        // if ((closestTableCell || closestTableHeader) && (closestTableRow)) {
        //     return 'YES'
        // }
        // if (closest && closest.before.node.type.name)
        //     console.log(closest.before.node.type.name)
      }
    } catch (error) {}
    return "NO";
    // const isInFirstRow = $head.node().type.name === 'tableRow' && $head.index(0) === 0;
    // return isInFirstRow ? 'YES' : 'NO2'
    // const tables = editor.$nodes('table')
    // return tables && tables.length > 0 ? tables.length : 0
  };
  useEffect(() => {
    if (!edit) setShowEditor(false);
    else {
      let timer = setTimeout(() => {
        setShowEditor(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [edit]);
  return (
    <>
      {editorObject && (
        <Box ref={editorObject.refSize}>
          <Box ref={editorObject.ref}>
            <RichTextEditor
              editor={editor}
              withTypographyStyles={false}
              className={editorObject.getThemPreviewClass()}
              style={{ border: editorObject.error ? "1px solid red" : "" }}
            >
              {edit && (
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <RichTextEditor.ControlsGroup>
                    <UndoRedo t={t} editor={editor} />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <Copy t={t} editor={editor} />
                    <ThemeToggle
                      t={t}
                      onThemeToggle={(val) => {
                        editorObject.setThemePreview(val);
                      }}
                    />
                    {editor && (
                      <RichTextEditor.Control
                        aria-label={
                          editorObject.fullscreen
                            ? t("exit_fullscreen", "Exit fullscreen")
                            : t("fullscreen", "Fullscreen")
                        }
                        title={
                          editorObject.fullscreen
                            ? t("exit_fullscreen", "Exit fullscreen")
                            : t("fullscreen", "Fullscreen")
                        }
                        onClick={editorObject.toggle}
                      >
                        <Box c={editorObject.fullscreen ? "red" : ""}>
                          {!editorObject.fullscreen && (
                            <IconArrowsMinimize stroke={1.5} size="1rem" />
                          )}
                          {editorObject.fullscreen && (
                            <IconArrowsMaximize stroke={1.5} size="1rem" />
                          )}
                        </Box>
                      </RichTextEditor.Control>
                    )}
                  </RichTextEditor.ControlsGroup>

                  <TableControl
                    t={t}
                    editor={editor}
                    showCellManip={false}
                    isFor={EditorFor.DEAL_ITEM}
                    editorObject={editorObject}
                  />
                </RichTextEditor.Toolbar>
              )}
              <ScrollArea.Autosize
                mah={
                  !editorObject.fullscreen
                    ? "500px"
                    : editorObject.small || editorObject.medium
                    ? "70vh"
                    : "80vh"
                }
                mih="200px"
                mx="auto"
                mt="0px"
                style={{ overflow: "auto" }}
              >
                <RichTextEditor.Content
                  mt={0}
                  mih={
                    !editorObject.fullscreen
                      ? "200px"
                      : editorObject.small || editorObject.medium
                      ? "70vh"
                      : "80vh"
                  }
                />
              </ScrollArea.Autosize>
            </RichTextEditor>
            {editorObject.showThemeToggle && (
              <Paper p="sm" withBorder mt="2px">
                <Group style={{ whiteSpace: "nowrap" }} gap={2}>
                  <Button
                    variant="light"
                    size="xs"
                    type="button"
                    onClick={() => {
                      editorObject.toggleTheme();
                      editorObject.postTheme();
                    }}
                  >
                    <Group>
                      <IconSwitchHorizontal size={18} />
                    </Group>
                  </Button>
                  <Box className={classesG.fontNotes}>
                    <span style={{ marginTop: 20 }}>
                      {t(
                        "please_switch_themes",
                        "**Please toggle between the dark and light themes to see how the editor content appears in each."
                      )}
                    </span>
                  </Box>
                </Group>
              </Paper>
            )}
          </Box>
        </Box>
      )}
    </>
  );
});
export const MemoEditorApp = memo(EditorApp);
export const MemoEditorAppPost = memo(EditorAppPost);

const TableControl = ({
  t,
  editor: editor0,
  showCellManip,
  isFor,
  editorObject,
}) => {
  const { enableTableBubbleMenu, setEnableTableBubbleMenu } = editorObject;
  // const [showBulb, setShowBubl] = useState(enableTableBubbleMenu)
  // useEffect(() => {
  //     setShowBubl(enableTableBubbleMenu)
  // }, [enableTableBubbleMenu])
  const { editor } = useRichTextEditorContext();
  const isTableHeaderSelected = () => {
    try {
      if (!editor) return false;
      const { $head } = editor.view.state.selection;
      if (!$head) return false;
      const myNodePos = editor.$pos($head.pos);
      if (myNodePos && myNodePos.closest) {
        let closestTableRow = myNodePos.closest("tableRow");
        if (
          closestTableRow &&
          closestTableRow.parent &&
          closestTableRow.parent.children
        ) {
          if (
            closestTableRow?.parent?.firstChild?.content ==
            closestTableRow.content
          )
            return true;
          // for (let i = 0; i < closestTableRow.parent.children.length; i++) {
          //     if (closestTableRow.parent.firstChild.content == closestTableRow.content)
          //         return true
          // }
        }
      }
    } catch (error) {}
    return false;
  };
  const { classes: classesG } = useGlobalStyl();
  return (
    <>
      {editor && (
        <RichTextEditor.ControlsGroup>
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              return (
                from == to &&
                editor.can().deleteTable() &&
                ((isFor == EditorFor.DEAL_ITEM && !isTableHeaderSelected()) ||
                  isFor !== EditorFor.DEAL_ITEM)
              );
            }}
          >
            {enableTableBubbleMenu && (
              <RichTextEditor.ControlsGroup
                style={{ backgroundColor: "black" }}
              >
                <TableColsManipMenu
                  editor={editor}
                  classesG={classesG}
                  t={t}
                  isIn={true}
                />
                <TableRowsManipMenu
                  editor={editor}
                  classesG={classesG}
                  t={t}
                  isIn={true}
                />
                <TableEnableBubbleMenu
                  editor={editor}
                  t={t}
                  editorObject={editorObject}
                  classesG={classesG}
                  isIn={true}
                />
              </RichTextEditor.ControlsGroup>
            )}
          </BubbleMenu>
          {/* <BubbleMenu
            editor={editor}
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              
              return (
                from == to &&
                editor.can().deleteTable() &&
                isFor == EditorFor.DEAL_ITEM &&
                isTableHeaderSelected()
              );
            }}
          >
            <RichTextEditor.ControlsGroup style={{ backgroundColor: "black" }}>
              <TableHeaderPost
                editor={editor}
                classesG={classesG}
                t={t}
                isIn={true}
                editorObject={editorObject}
              />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu> */}
          <TableAdd
            t={t}
            onAddTable={(rows, cols) => {
              if (!(rows > 0 && cols > 0)) return;
              let content_html = `<table style="border-collapse:collapse !important;table-layout:fixed !important;overflow: hidden !important;">`;
              for (let i = 0; i < rows; i++) {
                content_html = content_html + "<tr>";
                for (let j = 0; j < cols; j++) {
                  if (i == 0 && isFor == EditorFor.DEAL_ITEM && j <= 2) {
                    let cont = "";
                    switch (j) {
                      case 0:
                        cont = "Item";
                        break;
                      case 1:
                        cont = "Quantity";
                        break;
                      case 2:
                        cont = "Price";
                        break;
                    }
                    content_html =
                      content_html +
                      "<td><div>" +
                      cont +
                      "</div></td>";
                  } else
                    content_html =
                      content_html + "<td><div></div></td>";
                }
                content_html = content_html + "</tr>";
              }
              content_html = content_html + "</table>";
              editor0
                .chain()
                .focus()
                .insertContent(content_html, {
                  parseOptions: {
                    preserveWhitespace: false,
                  },
                })
                .run();
            }}
          />
          <RichTextEditor.Control
            onClick={() => editor.chain().focus().fixTables().run()}
            disabled={!editor.can().fixTables()}
            aria-label={t("fix_tables", "Fix tables")}
            title={t("fix_tables", "Fix tables")}
          >
            <Box h="16px" w="16px">
              <IconEyeTable stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().deleteTable() ? classesG.editorDisabledControl : ""
            }`}
            onClick={() => editor.chain().focus().deleteTable().run()}
            aria-label={t("del_table", "Delete table")}
            title={t("del_table", "Delete table")}
          >
            <Box c="red" h="16px" w="16px">
              <IconTableMinus stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      )}
      <TableColsManipMenu
        editor={editor}
        classesG={classesG}
        t={t}
        isIn={false}
      />
      <TableRowsManipMenu
        editor={editor}
        classesG={classesG}
        t={t}
        isIn={false}
      />

      {editor && showCellManip && (
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            className={`${
              !editor.can().mergeCells() ? classesG.editorDisabledControl : ""
            }`}
            onClick={() => editor.chain().focus().mergeCells().run()}
            aria-label={t("merge_cells", "Merge cells")}
            title={t("merge_cells", "Merge cells")}
          >
            <Box h="16px" w="16px">
              <IconArrowsJoin2 stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().splitCell() ? classesG.editorDisabledControl : ""
            }`}
            onClick={() => editor.chain().focus().splitCell().run()}
            aria-label={t("split_cell", "Split cell")}
            title={t("split_cell", "Split cell")}
          >
            <Box h="16px" w="16px">
              <IconArrowsSplit2 stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      )}
      <TableEnableBubbleMenu
        editor={editor}
        t={t}
        editorObject={editorObject}
        classesG={classesG}
        isIn={false}
      />
    </>
  );
};
const TableColsManipMenu = ({ editor, classesG, t, isIn }) => {
  return (
    <>
      {editor && (
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            className={`${
              !editor.can().addColumnBefore()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            aria-label={t("add_col_before", "Add column before")}
            title={t("add_col_before", "Add column before")}
          >
            <Box h="16px" w="16px">
              <IconColumnInsertLeft stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().addColumnAfter()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            aria-label={t("add_col_after", "Add column after")}
            title={t("add_col_after", "Add column after")}
          >
            <Box h="16px" w="16px">
              <IconColumnInsertRight stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().deleteColumn()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().deleteColumn().run()}
            aria-label={t("del_col", "Delete column")}
            title={t("del_col", "Delete column")}
          >
            <Box c="red" h="16px" w="16px">
              <IconColumnRemove stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      )}
    </>
  );
};
const TableRowsManipMenu = ({ editor, classesG, t, isIn }) => {
  return (
    <>
      {editor && (
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            className={`${
              !editor.can().addRowBefore()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().addRowBefore().run()}
            aria-label={t("add_row_before", "Add row before")}
            title={t("add_row_before", "Add row before")}
          >
            <Box h="16px" w="16px">
              <IconRowInsertTop stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().addRowAfter()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().addRowAfter().run()}
            aria-label={t("add_row_after", "Add row after")}
            title={t("add_row_after", "Add row after")}
          >
            <Box h="16px" w="16px">
              <IconRowInsertBottom stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>

          <RichTextEditor.Control
            className={`${
              !editor.can().deleteRow()
                ? classesG.editorDisabledControl
                : isIn
                ? classesG.editorBulbMenuledControl
                : ""
            }`}
            onClick={() => editor.chain().focus().deleteRow().run()}
            aria-label={t("del_row", "Delete row")}
            title={t("del_row", "Delete row")}
          >
            <Box c="red" h="16px" w="16px">
              <IconRowRemove stroke={1.5} size="1rem" />
            </Box>
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      )}
    </>
  );
};
const TableHeaderPost = ({ editor, classesG, t, isIn, editorObject }) => {
  // const ref = useRef<any>()
  // const ref2 = useRef<any>()
  // const [opened, setOpened] = useState(true)
  // const handleClickOutside = (event) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //         if (ref2.current && !ref2.current.contains(event.target))
  //             setOpened(false)
  //     }
  // }
  // useEffect(() => {
  //     document.addEventListener('click', handleClickOutside);
  //     return () => {
  //         document.removeEventListener('click', handleClickOutside);
  //     };
  // }, []);
  const replace = (by) => {
    try {
      if (!editor) return false;
      const { $head } = editor.view.state.selection;
      if (!$head) return false;
      const myNodePos = editor.$pos($head.pos);
      if (myNodePos) {
        myNodePos.content = by;
      }
    } catch (error) {}
    return false;
  };
  const suggest = (op, nam) => {
    if (isEqual(nam)) return false;
    try {
      if (!editor) return false;
      const { $head } = editor.view.state.selection;
      if (!$head) return false;
      const myNodePos = editor.$pos($head.pos);
      if (myNodePos) {
        switch (op) {
          case "item":
            return message_to_post_fields_map.isItem(myNodePos.textContent);
          case "quantity":
            return message_to_post_fields_map.isQuantity(myNodePos.textContent);
          case "price":
            return message_to_post_fields_map.isPrice(myNodePos.textContent);
          default:
            return false;
        }
      }
    } catch (error) {}
    return false;
  };
  const isEqual = (nam) => {
    try {
      if (!editor) return false;
      const { $head } = editor.view.state.selection;
      if (!$head) return false;
      const myNodePos = editor.$pos($head.pos);
      if (myNodePos) {
        return myNodePos.textContent.toUpperCase() === nam.toUpperCase();
      }
    } catch (error) {}
    return false;
  };
  return (
    <>
      {editor && (
        <Menu shadow="md" width={120} offset={30} opened={true}>
          <Menu.Target>
            <Box></Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{t("column_is", "Column is")}</Menu.Label>
            <Menu.Item
              onClick={() => {
                replace("Item");
              }}
              rightSection={
                <>
                  {suggest("item", "Item") && <IconQuestionMark size={16} />}
                  {isEqual("Item") && (
                    <Box c="green">
                      <IconChecks size={16} />
                    </Box>
                  )}
                </>
              }
            >
              {t("item", "Item")}
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                replace("Quantity");
              }}
              rightSection={
                <>
                  {suggest("quantity", "Quantity") && (
                    <IconQuestionMark size={16} />
                  )}
                  {isEqual("Quantity") && (
                    <Box c="green">
                      <IconChecks size={16} />
                    </Box>
                  )}
                </>
              }
            >
              {t("quantity", "Quantity")}
            </Menu.Item>
            {/* <Menu.Item onClick={() => { replace('Price') }} rightSection={<>{suggest('price', 'Price') && <Box c="green"><IconChecks size={16} /></Box>}</>}>{t('price', 'Price')}</Menu.Item> */}
            <Menu.Item
              onClick={() => {
                replace("Price");
              }}
              rightSection={
                <>
                  {suggest("price", "Price") && <IconQuestionMark size={16} />}
                  {isEqual("Price") && (
                    <Box c="green">
                      <IconChecks size={16} />
                    </Box>
                  )}
                </>
              }
            >
              {t("price", "Price")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
};
const TableEnableBubbleMenu = ({ editor, t, editorObject, classesG, isIn }) => {
  const { enableTableBubbleMenu, setEnableTableBubbleMenu } = editorObject;
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          className={`${isIn ? classesG.editorBulbMenuledControl : ""}`}
          onClick={() => {
            setEnableTableBubbleMenu((o) => !o);
          }}
          aria-label={
            enableTableBubbleMenu
              ? t("hide_bubble_in_table", "Hide table bubble menu")
              : t("show_bubble_in_table", "Show table bubble menu")
          }
          title={
            enableTableBubbleMenu
              ? t("hide_bubble_in_table", "Hide table bubble menu")
              : t("show_bubble_in_table", "Show table bubble menu")
          }
        >
          {!enableTableBubbleMenu && (
            <Box c="red" h="16px" w="16px">
              <IconTableOptions stroke={1.5} size="1rem" />
            </Box>
          )}
          {enableTableBubbleMenu && (
            <Box c="red" h="16px" w="16px">
              <IconTableOff stroke={1.5} size="1rem" />
            </Box>
          )}
        </RichTextEditor.Control>
      )}
    </>
  );
};
const TableAdd = ({ t, onAddTable }) => {
  const [rowId, setRowId] = useState(-1);
  const [colId, setColId] = useState(-1);
  const { classes: classesG } = useGlobalStyl();
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  const [opt, setOpt] = useState(1);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (opened) {
      setRowId(-1);
      setColId(-1);
    }
  }, [opened]);
  const createTableDraft = () => {
    let cells: any = [];
    for (let i = 0; i < 10; i++) {
      cells.push({ id: i });
    }
    const rows = cells?.map((row) => (
      <Table0.Tr key={row.id}>
        {cells?.map((col, idx) => (
          <Table0.Td
            key={idx}
            className={
              row.id <= rowId && rowId >= 0 && col.id <= colId && colId >= 0
                ? classesG.editorTableDraftUpTo
                : ""
            }
            onMouseEnter={() => {
              setRowId(row.id);
              setColId(col.id);
            }}
            onMouseDown={() => {
              onAddTable(row.id + 1, col.id + 1);
              setOpened(false);
            }}
          >
            {}
          </Table0.Td>
        ))}
      </Table0.Tr>
    ));
    return (
      <Table0 unstyled className={classesG.editorTableDraft}>
        <Table0.Tbody>{rows}</Table0.Tbody>
      </Table0>
    );
  };
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("insert_table", "Insert table")}
          title={t("insert_table", "Insert table")}
        >
          <Box ref={ref} h="16px" w="16px">
            <Popover
              opened={opened}
              width={180}
              trapFocus
              position="bottom"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                {/* <IconPalette stroke={1.5} size="1rem" /> */}
                <Box
                  onMouseDown={() => {
                    setOpened((o) => !o);
                  }}
                >
                  <IconTablePlus stroke={1.5} size="1rem" />
                </Box>
              </Popover.Target>

              <Popover.Dropdown
              // sx={(theme) => ({
              //   background:
              //     theme.colorScheme === "dark"
              //       ? theme.colors.dark[7]
              //       : theme.white,
              // })}
              >
                {createTableDraft()}
                <Group justify="center" gap="xs" mt="md">
                  {rowId >= 0 && rowId < 10 && colId >= 0 && colId < 10 && (
                    <Box>
                      {rowId + 1}
                      {"x"}
                      {colId + 1}
                    </Box>
                  )}
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const Colors = ({ t, purpose, title, ...others }) => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useRef<any>(null); //useClickOutside(() => setOpened(false));
  const ref2 = useRef<any>(null);
  const [opt, setOpt] = useState(1);
  const [color, setColor] = useState("");
  const update = (color0, unset?) => {
    let color_to_upd = color0 ? color0 : color;
    if (unset) {
      color_to_upd = null;
    }

    if (purpose === ColorContrlPurpoese.BACK) {
      if (editor?.can().setCellAttribute("backgroundColor", "")) {
        editor
          .chain()
          .focus()
          .setCellAttribute("backgroundColor", color_to_upd)
          .run();
      } else {
        editor?.chain().focus().setBackColor(color_to_upd).run();
      }
    } else {
      editor?.chain().focus().setColor(color_to_upd).run();
    }

    setOpened(false);
  };
  useEffect(() => {
    if (others && others.onPopover) others.onPopover(opened);
  }, [opened]);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (ref2.current && !ref2.current.contains(event.target))
        setOpened(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      {editor && (
        <RichTextEditor.Control aria-label={title} title={title}>
          <Box ref={ref} h="16px" w="16px">
            <Popover
              opened={opened}
              width={300}
              trapFocus
              position="bottom"
              withArrow
              shadow="md"
              withinPortal={true}
            >
              <Popover.Target>
                {/* <IconPalette stroke={1.5} size="1rem" /> */}
                <Box
                  onMouseDown={() => {
                    setOpened((o) => !o);
                  }}
                  c={purpose == ColorContrlPurpoese.TEXT ? "violet" : ""}
                >
                  {purpose == ColorContrlPurpoese.BACK && (
                    <IconPalette stroke={1.5} size="1rem" />
                  )}
                  {purpose != ColorContrlPurpoese.BACK && (
                    <IconCircleFilled stroke={1.5} size="1rem" />
                  )}
                </Box>
              </Popover.Target>

              <Popover.Dropdown
              // sx={(theme) => ({
              //   background:
              //     theme.colorScheme === "dark"
              //       ? theme.colors.dark[7]
              //       : theme.white,
              // })}
              >
                <Box ref={ref2}>
                  <ColorInput
                    mb="sm"
                    withPicker={false}
                    value={color}
                    onChange={(color0) => {
                      setColor(color0);
                    }}
                    format="hex"
                    // swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                  />
                  <ColorPicker
                    value={color}
                    withPicker={opt == 1}
                    onColorSwatchClick={(color0) => {
                      setColor(color0);
                      update(color0);
                    }}
                    onChange={(color0) => {
                      setColor(color0);
                    }}
                    format="hex"
                    // swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                    swatches={
                      opt == 2
                        ? [
                            ...DEFAULT_THEME.colors.red,
                            ...DEFAULT_THEME.colors.green,
                            ...DEFAULT_THEME.colors.lime,
                            ...DEFAULT_THEME.colors.blue,
                            ...DEFAULT_THEME.colors.indigo,
                            ...DEFAULT_THEME.colors.grape,
                            ...DEFAULT_THEME.colors.yellow,
                            ...DEFAULT_THEME.colors.orange,
                            ...DEFAULT_THEME.colors.gray,
                            ...DEFAULT_THEME.colors.dark,
                          ]
                        : []
                    }
                  />

                  <Group justify="right" gap="xs" mt="md">
                    <ActionIcon
                      variant="outline"
                      c="red"
                      onMouseDown={() => setOpened(false)}
                      title={t("cancel", "Cancel")}
                    >
                      <IconX stroke={1.5} size="1rem" />
                    </ActionIcon>
                    {opt == 2 && (
                      <ActionIcon
                        variant="outline"
                        onMouseDown={() => setOpt(1)}
                        title={t("color_pallet", "Color pallet")}
                      >
                        <IconPalette stroke={1.5} size="1rem" />
                      </ActionIcon>
                    )}
                    {opt == 1 && (
                      <ActionIcon
                        variant="outline"
                        onMouseDown={() => setOpt(2)}
                        title={t("color_picker", "Color picker")}
                      >
                        <IconColorPicker stroke={1.5} size="1rem" />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      variant="outline"
                      color="red"
                      onMouseDown={() => update("", true)}
                      title={t("unset_color", "Unset color")}
                    >
                      <Box h="16px" w="16px">
                        <IconCircleOff stroke={1.5} size="1rem" />
                      </Box>
                    </ActionIcon>
                    <ActionIcon
                      variant="filled"
                      color="primary"
                      onMouseDown={() => update(null)}
                      title={t("confirm", "Confirm")}
                    >
                      <IconCheck stroke={1.5} size="1rem" />
                    </ActionIcon>
                  </Group>
                </Box>
              </Popover.Dropdown>
            </Popover>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const LineHeight = ({ t }) => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("line_height", "Line height")}
          title={t("line_height", "Line height")}
        >
          <Box ref={ref} h="16px" w="16px">
            <Menu shadow="md" width={50} opened={opened}>
              <Menu.Target>
                {/* <IconLineHeight stroke={1.5} size="1rem" /> */}
                <Box
                  onMouseDown={() => {
                    setOpened((p) => !p);
                  }}
                >
                  <IconLineHeight stroke={1.5} size="1rem" />
                </Box>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("1").run();

                    setOpened(false);
                  }}
                >
                  1
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("1.5").run();
                    setOpened(false);
                  }}
                >
                  1.5
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("2").run();

                    setOpened(false);
                  }}
                >
                  2
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("2.5").run();

                    setOpened(false);
                  }}
                >
                  2.5
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("3").run();

                    setOpened(false);
                  }}
                >
                  3
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    editor.chain().focus().setLineHeight("4").run();

                    setOpened(false);
                  }}
                >
                  4
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const TextAlign2 = ({ t }) => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("align", "Align")}
          title={t("align", "Align")}
        >
          <Box ref={ref} h="16px" w="16px">
            <Menu shadow="md" width={50} opened={opened}>
              <Menu.Target>
                {/* <IconBaselineDensitySmall stroke={1.5} size="1rem" /> */}

                <Box
                  onMouseDown={() => {
                    setOpened(true);
                  }}
                >
                  <IconBaselineDensitySmall stroke={1.5} size="1rem" />
                </Box>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  title={t("align_left", "Align left")}
                  leftSection={<IconAlignLeft stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("left").run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("align_right", "Align right")}
                  leftSection={<IconAlignRight stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("right").run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("align_center", "Align center")}
                  leftSection={<IconAlignCenter stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("center").run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("align_justify", "Align justify")}
                  leftSection={<IconAlignJustified stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().setTextAlign("justify").run();
                    setOpened(false);
                  }}
                ></Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const Heading = ({ t }) => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("heading", "Heading")}
          title={t("heading", "Heading")}
        >
          <Box ref={ref} h="16px" w="16px">
            <Menu shadow="md" width={50} opened={opened}>
              <Menu.Target>
                {/* <IconHeading stroke={1.5} size="1rem" /> */}

                <Box
                  onMouseDown={() => {
                    setOpened((p) => !p);
                  }}
                >
                  <IconHeading stroke={1.5} size="1rem" />
                </Box>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  title={t("heading_1", "Heading 1")}
                  leftSection={<IconH1 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("heading_2", "Heading 2")}
                  leftSection={<IconH2 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("heading_3", "Heading 3")}
                  leftSection={<IconH3 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("heading_4", "Heading 4")}
                  leftSection={<IconH4 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 4 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("heading_5", "Heading 5")}
                  leftSection={<IconH5 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 5 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
                <Menu.Item
                  title={t("heading_6", "Heading 6")}
                  leftSection={<IconH6 stroke={1.5} size="1rem" />}
                  onClick={() => {
                    editor.chain().focus().toggleHeading({ level: 6 }).run();
                    setOpened(false);
                  }}
                ></Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const FontSize = ({ t }) => {
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  const ref = useClickOutside(() => setOpened(false));
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("size", "Size")}
          title={t("size", "Size")}
        >
          <Box ref={ref} h="16px" w="16px">
            <Menu shadow="md" width={150} opened={opened}>
              <Menu.Target>
                <Box
                  onMouseDown={() => {
                    setOpened((p) => !p);
                  }}
                >
                  <IconTextSize stroke={1.5} size="1rem" />
                </Box>
              </Menu.Target>

              <Menu.Dropdown>
                {/* <Menu.Item title={t('xsmall', 'X Small')} icon={<IconH1 stroke={1.5} size="1rem" />} onClick={() => editor.chain().focus().setFontSize('0.6rem').run()}>
                            {t('small', 'Small')}
                        </Menu.Item> */}
                <Menu.Item
                  title={t("small", "Small")}
                  onClick={() => {
                    editor.chain().focus().setFontSize("0.75rem").run();
                    setOpened(false);
                  }}
                >
                  <Box fz="0.75rem">{t("small", "Small")}</Box>
                </Menu.Item>
                <Menu.Item
                  title={t("normal", "Normal")}
                  onClick={() => {
                    editor.chain().focus().setFontSize("1rem").run();
                    setOpened(false);
                  }}
                >
                  <Box fz="1rem">{t("normal", "Normal")}</Box>
                </Menu.Item>
                <Menu.Item
                  title={t("large", "Large")}
                  onClick={() => {
                    editor.chain().focus().setFontSize("1.2rem").run();
                    setOpened(false);
                  }}
                >
                  <Box fz="1.2rem">{t("large", "Large")}</Box>
                </Menu.Item>
                <Menu.Item
                  title={t("huge", "Huge")}
                  onClick={() => {
                    editor.chain().focus().setFontSize("1.4rem").run();
                    setOpened(false);
                  }}
                >
                  <Box fz="1.4rem"> {t("huge", "Huge")}</Box>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const UndoRedo = ({ t, editor }) => {
  // const { editor } = useRichTextEditorContext();
  const { classes: classesG } = useGlobalStyl();
  return (
    <>
      {editor && (
        <>
          <RichTextEditor.Control
            className={`${
              !editor.can().undo() ? classesG.editorDisabledControl : ""
            }`}
            onClick={() => editor.chain().focus().undo().run()}
            aria-label={t("undo", "Undo")}
            title={t("undo", "Undo")}
          >
            <IconArrowBackUp stroke={1.5} size="1rem" />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            className={`${
              !editor.can().redo() ? classesG.editorDisabledControl : ""
            }`}
            onClick={() => editor.chain().focus().redo().run()}
            aria-label={t("redo", "Redo")}
            title={t("redo", "Redo")}
          >
            <IconArrowForwardUp stroke={1.5} size="1rem" />
          </RichTextEditor.Control>
        </>
      )}
    </>
  );
};
const Copy = ({ t, editor }) => {
  // const {editor:editor2 } = useRichTextEditorContext();
  const { classes: classesG } = useGlobalStyl();
  const clipboard = useClipBoarHtml({ timeout: 750, timeouthtml: 10000, t: t });
  return (
    <>
      {editor && (
        <>
          <RichTextEditor.Control
            onClick={() => {
              let html = editor.getHTML();
              let text = editor.getText();
              clipboard.copyhtml(html, text);
            }}
            aria-label={t("copy", "Copy")}
            title={t("copy", "Copy")}
          >
            <Box c="blue.7" h="16px" w="16px">
              <IconCopy stroke={1.5} size="16px" />
            </Box>
          </RichTextEditor.Control>
        </>
      )}
    </>
  );
};
const ThemeToggle = ({ t, onThemeToggle }) => {
  const ref = useClickOutside(() => {
    setOpened(false);
  });
  const { editor } = useRichTextEditorContext();
  const [opened, setOpened] = useState(false);
  let { theme } = useAppTheme();

  const [saved, setSaved] = useState(() => {
    return theme;
  });
  const [current, setCurrent] = useState<any>(null);
  // const [current, setCurrent] = useState<any>(null)
  // const [snapshot, setSnapshot] = useState<any>(null)

  const update = (val) => {
    setCurrent(val);
    onThemeToggle(val);
  };
  const showIcon = (val) => {
    if (!opened) return saved == val;
    return (current && current == val) || (!current && saved == val);
  };
  useEffect(() => {
    if (opened) setCurrent(saved);
    if (!opened) onThemeToggle(saved);
  }, [opened]);
  useEffect(() => {
    setCurrent(theme);
    setSaved(theme);
    onThemeToggle(null);
  }, [theme]);
  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("theme", "Theme")}
          title={t("theme", "Theme")}
        >
          <Box ref={ref}>
            <Popover
              opened={opened}
              width={250}
              trapFocus
              position="bottom"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                {/* <IconPalette stroke={1.5} size="1rem" /> */}
                <Box
                  onMouseDown={() => {
                    setOpened((o) => !o);
                  }}
                  h="16px"
                  w="16px"
                >
                  <IconBrightness stroke={1.5} size="1rem" />
                  {/* {current === 'light' && <IconBrightnessUp stroke={1.5} size="1rem" />}
                                {current === 'dark' && <IconMoon stroke={1.5} size="1rem" />}
                                {current === 'dim' && <IconMoon2 stroke={1.5} size="1rem" />} */}
                  {/* {!current && <IconMoon2 stroke={1.5} size="1rem" />} */}
                </Box>
              </Popover.Target>

              <Popover.Dropdown
              // sx={(theme) => ({
              //   background:
              //     theme.colorScheme === "dark"
              //       ? theme.colors.dark[7]
              //       : theme.white,
              // })}
              >
                <Group justify="right">
                  <SegmentedControl
                    transitionDuration={100}
                    defaultValue={saved}
                    value={current}
                    onChange={(val) => {
                      update(val);
                    }}
                    data={[
                      {
                        value: "light",
                        label: (
                          <Center>
                            <IconBrightnessUp size="1rem" />
                            <Box ml={10}>{t("light", "Light")}</Box>
                          </Center>
                        ),
                      },
                      {
                        value: "dark",
                        label: (
                          <Center>
                            <IconMoon size="1rem" />
                            <Box ml={10}>{t("dark", "Dark")}</Box>
                          </Center>
                        ),
                      },
                      {
                        value: "dim",
                        label: (
                          <Center>
                            <IconMoon2 size="1rem" />
                            <Box ml={10}>{t("dim", "Dim")}</Box>
                          </Center>
                        ),
                      },
                    ]}
                  />
                </Group>

                <Group justify="right" gap="xs" mt="md">
                  <ActionIcon
                    variant="outline"
                    c="red"
                    onClick={() => setOpened(false)}
                    title={t("cancel", "Cancel")}
                  >
                    <IconX stroke={1.5} size="1rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="outline"
                    color="red"
                    onClick={() => {
                      setSaved(theme);
                      setOpened(false);
                    }}
                    title={t("unset_theme", "Unset theme")}
                  >
                    <IconCircleOff stroke={1.5} size="1rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color="primary"
                    onClick={() => {
                      setSaved(current);
                      setOpened(false);
                    }}
                    title={t("confirm", "Confirm")}
                  >
                    <IconCheck stroke={1.5} size="1rem" />
                  </ActionIcon>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
const countTables = ({ editor }) => {
  if (!editor) return -1;

  try {
    const { $head } = editor.view.state.selection;
    if (!$head) return -1;
    const myNodePos = editor.$pos($head.pos);
    if (myNodePos && myNodePos.closest) {
      let before = null;
      let closestTableRow = myNodePos.closest("tableRow");
      // let closestTableCell = myNodePos.closest('tableCell')
      // let closestTableHeader = myNodePos.closest('tableHeader')
      if (
        closestTableRow &&
        closestTableRow.parent &&
        closestTableRow.parent.children
      ) {
        for (let i = 0; i < closestTableRow.parent.children.length; i++) {
          if (
            closestTableRow?.parent?.firstChild?.content ==
            closestTableRow?.content
          )
            return "YES";
        }
      }
      // if ((closestTableCell || closestTableHeader) && (closestTableRow)) {
      //     return 'YES'
      // }
      // if (closest && closest.before.node.type.name)
      //     console.log(closest.before.node.type.name)
    }
  } catch (error) {}
  return "NO";
  // const isInFirstRow = $head.node().type.name === 'tableRow' && $head.index(0) === 0;
  // return isInFirstRow ? 'YES' : 'NO2'
  // const tables = editor.$nodes('table')
  // return tables && tables.length > 0 ? tables.length : 0
};
const EmojiPickerControl = ({ t, classesG, editor, ...others }) => {
  // const { editor } = useRichTextEditorContext();
  const [value, setValue] = useState("");
  const [blockScrollTrigger, setBlockScrollTrigger] = useState(false);
  // const [debounced] = useDebouncedState(value, 100);

  let {
    emojiGroups: emojiGroups0,
    search,
    emojiAllGroups: emojiAllGroups0,
  } = useEmoji({ t: t });
  let emojiGroups = emojiGroups0 ? emojiGroups0 : {};
  // let emojiAllGroups = emojiAllGroups0 ? emojiAllGroups0 : {}

  let [current, setCurrent] = useState(0);
  let [mouseInIdx, setMouseInIdx] = useState(0);
  const viewport = useRef<any>(null);
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const [opened, setOpened] = useState(false);
  const views: any = Array.from({ length: 8 }, (idx) => {
    const refV = useRef<HTMLDivElement>(null);
    const { ref, entry } = useIntersection<any>({
      root: viewport.current,
      threshold: 0.1,
    });
    return { ref: ref, entry: entry, refV: refV, idx: idx };
  });
  const scrolInto = (viewKey) => {
    try {
      setBlockScrollTrigger(true);
      setTimeout(() => {
        setBlockScrollTrigger(false);
      }, 1000);
      setCurrent(viewKey);
      let trgt = views[viewKey].refV;

      trgt = trgt.current;
      var topPosition = trgt?.offsetTop + (viewKey == 0 ? 0 : 20);
      viewport?.current?.scrollTo({ top: topPosition, behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (others && others.onPopover) others.onPopover(opened);
  }, [opened]);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (ref2.current && !ref2.current.contains(event.target))
        setOpened(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getCurrentGroup = () => {
    if (!emojiGroups) return;
    let crnt = "";
    Object.keys(emojiGroups).map((key_group, idx) => {
      if (idx == current) crnt = emojiGroups[key_group]["group"];
    });
    return crnt;
  };

  return (
    <>
      {editor && (
        <RichTextEditor.Control
          aria-label={t("emoji", "Emoji")}
          title={t("emoji", "Emoji")}
        >
          <Box ref={ref}>
            <Popover
              withinPortal={true}
              opened={opened}
              width={325}
              trapFocus
              position="bottom"
              withArrow={false}
              shadow="md"
            >
              <Popover.Target>
                <Box
                  onMouseDown={() => {
                    setOpened((o) => !o);
                    setValue("");
                    search("");
                    setCurrent(0);
                  }}
                >
                  <IconMoodSmile stroke={1.5} size="1rem" />
                </Box>
              </Popover.Target>

              <Popover.Dropdown
                p={0}
                // sx={(theme) => ({
                //   background:
                //     theme.colorScheme === "dark"
                //       ? theme.colors.dark[7]
                //       : theme.white,
                // })}
              >
                <Group justify="center" w="100%" gap={0} ref={ref2} p={5} m={0}>
                  <Group
                    justify="space-between"
                    w="100% !important"
                    p={5}
                    pl={15}
                    mt={10}
                  >
                    <TextInput
                      variant="default"
                      leftSection={<IconSearch size="0.8rem" />}
                      value={value}
                      onChange={(event) => {
                        let val = event.currentTarget.value;
                        setValue(val);
                        search(val);
                        setCurrent(0);
                      }}
                    />
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => setOpened(false)}
                      title={t("cancel", "Cancel")}
                    >
                      <IconX stroke={1.5} size="1rem" />
                    </ActionIcon>
                  </Group>
                  <Box p={15} mb={0} pb={0}>
                    <SimpleGrid cols={8} m={0}>
                      {Object.keys(emojiGroups).map((key_group, idx) => (
                        <Box
                          title={emojiGroups[key_group].group}
                          c={idx == current ? "blue" : ""}
                          key={key_group + "grp_icon"}
                          style={{ cursor: "pointer" }}
                          onMouseDown={() => {
                            scrolInto(idx);
                          }}
                        >
                          {emojiGroups[key_group].icon_group}
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Group
                    justify="left"
                    w="100% !important"
                    p={5}
                    pl={15}
                    pb={5}
                    pt={5}
                  >
                    <Box>{getCurrentGroup()}</Box>
                  </Group>
                  <ScrollArea.Autosize
                    p={0}
                    m={0}
                    mah={300}
                    mx="auto"
                    w="100%"
                    offsetScrollbars
                    viewportRef={viewport}
                    onScrollPositionChange={() => {
                      if (blockScrollTrigger) return;
                      for (let i = 0; i < views.length; i++) {
                        if (views[i]?.entry?.isIntersecting) {
                          setCurrent(i);
                          // break
                        }
                      }
                    }}
                  >
                    <Group justify="center" p="0px" pt="0px" m={0}>
                      {Object.keys(emojiGroups).map((key_group, idx) => (
                        <React.Fragment key={key_group + "frg"}>
                          <Box ref={views[idx]?.ref}>
                            <Group
                              pl={0}
                              justify="left"
                              w="100% !important"
                              key={key_group + "grp"}
                              ref={views[idx]?.refV}
                            >
                              {idx >= 1 && (
                                <Box>{emojiGroups[key_group]["group"]}</Box>
                              )}
                            </Group>
                            <Box key={key_group + "grd"} mt={15}>
                              <SimpleGrid
                                cols={8}
                                m={0}
                                p={0}
                                key={key_group + "grd2"}
                              >
                                {emojiGroups[key_group]["emojis"]?.map(
                                  (emoji, idxx) => (
                                    <Box
                                      title={emoji.name}
                                      className="emoji-hover"
                                      style={{ cursor: "pointer" }}
                                      key={emoji.name}
                                      onMouseDown={() => {
                                        editor?.commands.insertContent(
                                          emoji.emoji
                                        );
                                        setOpened(false);
                                      }}
                                    >
                                      <Box>{emoji.emoji}</Box>
                                    </Box>
                                  )
                                )}
                              </SimpleGrid>
                            </Box>
                          </Box>
                        </React.Fragment>
                      ))}
                    </Group>
                  </ScrollArea.Autosize>
                </Group>
              </Popover.Dropdown>
            </Popover>
          </Box>
        </RichTextEditor.Control>
      )}
    </>
  );
};
export type ColorOptions = {
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    backColor: {
      /**
       * Set the text color
       */
      setBackColor: (color: string) => ReturnType;
      /**
       * Unset the text color
       */
      unsetBackColor: () => ReturnType;
    };
  }
}

export const BackColorStyle = Extension.create<ColorOptions>({
  name: "backColor",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) =>
              element.style.backgroundColor.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { backgroundColor: color }).run();
        },
      unsetBackColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { backgroundColor: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the text color
       */
      setLineHeight: (color: string) => ReturnType;
      /**
       * Unset the text color
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}
export const LineHeightStyle = Extension.create<ColorOptions>({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: { style: `line-height: 1.5` },
            parseHTML: (element) =>
              element.style.lineHeight.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return { style: `line-height: 1.5` };
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight: lineHeight }).run();
        },
      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { lineHeight: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the text color
       */
      setFontSize: (color: string) => ReturnType;
      /**
       * Unset the text color
       */
      unsetFontSize: () => ReturnType;
    };
  }
}
export const FontSizeStyle = Extension.create<ColorOptions>({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
// export const FontSizeStyle = Extension.create<ColorOptions>({
//   name: "fontSize",
//   addOptions() {
//     return {
//       types: ["textStyle"],
//     };
//   },
//   addGlobalAttributes() {
//     return [
//       {
//         types: this.options.types,
//         attributes: {
//           fontSize: {
//             default: null,
//             parseHTML: (element) =>
//               element.style.fontSize.replace(/['"]+/g, ""),
//             renderHTML: (attributes) => {
//               if (!attributes.fontSize) {
//                 return {};
//               }
//               return {
//                 style: `font-size: ${attributes.fontSize}`,
//               };
//             },
//           },
//         },
//       },
//     ];
//   },

//   addCommands() {
//     return {
//       setFontSize:
//         (fontSize) =>
//         ({ chain }) => {
//           return chain().setMark("textStyle", { fontSize: fontSize }).run();
//         },
//       unsetFontSize:
//         () =>
//         ({ chain }) => {
//           return chain()
//             .setMark("textStyle", { fontSize: null })
//             .removeEmptyTextStyle()
//             .run();
//         },
//     };
//   },
// });
 
//   return (
//     <>
//       <Table0>
//         <Table0.Thead>
//           <Table0.Tr>
//             <Table0.Th>Element position</Table0.Th>
//             <Table0.Th>Element name</Table0.Th>
//             <Table0.Th>Symbol</Table0.Th>
//             <Table0.Th>Atomic mass</Table0.Th>
//           </Table0.Tr>
//         </Table0.Thead>
//         <Table0.Tbody>{rows}</Table0.Tbody>
//       </Table0>

//       <Table0 unstyled>
//         <Table0.Thead>
//           <Table0.Tr>
//             <Table0.Th>Element position</Table0.Th>
//             <Table0.Th>Element name</Table0.Th>
//             <Table0.Th>Symbol</Table0.Th>
//             <Table0.Th>Atomic mass</Table0.Th>
//           </Table0.Tr>
//         </Table0.Thead>
//         <Table0.Tbody>{rows}</Table0.Tbody>
//       </Table0>
//     </>
//   );
// }
 

const message_to_post_fields_map = {
  item: ["item", "items", "name", "names", "description"],
  quantity: ["quantity", "quantities", "case", "cases"],
  price: ["price", "prices"],
  isItem: (name) => {
    return message_to_post_fields_map.isMapped(
      message_to_post_fields_map.item,
      name
    );
  },
  isQuantity: (name) => {
    return message_to_post_fields_map.isMapped(
      message_to_post_fields_map.quantity,
      name
    );
  },
  isPrice: (name) => {
    return message_to_post_fields_map.isMapped(
      message_to_post_fields_map.price,
      name
    );
  },
  isMapped: (obj_values, name) => {
    for (let i = 0; i < obj_values.length; i++) {
      if (
        obj_values[i].toString().toUpperCase() === name.toString().toUpperCase()
      )
        return true;
    }
    for (let i = 0; i < obj_values.length; i++) {
      if (
        name
          .toString()
          .toUpperCase()
          .includes(obj_values[i].toString().toUpperCase())
      )
        return true;
    }
    return false;
  },
};
