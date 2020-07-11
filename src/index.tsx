import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Button,
  Form,
  TextField,
  useAction,
  useState,
  Image,
  ModalDialog,
  Table,
  Cell,
  Row,
} from "@forge/ui";

import api from "@forge/api";
import { useContentProperty } from "@forge/ui-confluence";

const FACE_DETECT_API =
  "https://atlassian-forge-functions.azurewebsites.net/api/face/FaceDetect";

const App = () => {
  //storage
  const [contentData, setContentData] = useContentProperty(
    "face-detect-data",
    {}
  );

  //modal Properties
  const [isModelOpen, setModalOpen] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState(null);
  const [modalHasData, setModalHasData] = useState(false);
  const [modalImageTitle, setModalImageTitle] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [modalFaceImages, setModalFaceImages] = useState(null);

  //macro properties
  const [hasData, setHasData] = useState(false);
  const [uiPageImageTitle, setUIPageImageTitle] = useState(null);
  const [uiPageImage, setUIPageImage] = useState(null);
  const [uiPageFaces, setUIPageFaces] = useState([]);

  const [localData, setLocalData] = useAction(
    async (_, newValue) => {
      if (newValue["title"] != null) {
        await setContentData(newValue);
        setHasData(true);
      } else {
        await setContentData({});
        setHasData(false);
      }
      return newValue;
    },
    () => {
      if (contentData["originalImage"] != null) {
        setHasData(true);
        setUIPageImageTitle(contentData["title"]);
        setUIPageImage(contentData["originalImage"]);
        setUIPageFaces(contentData["faces"]);

        return contentData;
      }

      setHasData(false);
      return {};
    }
  );

  async function fetchFaces(imagePath) {
    const faceDetectResponse = await api.fetch(
      `${FACE_DETECT_API}?imagePath=${imagePath}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );

    await checkResponse("Face Detect", faceDetectResponse);
    var isSuccess = false;

    if (faceDetectResponse.ok) {
      const { originalImage, faces } = await faceDetectResponse.json();
      isSuccess = true;
      return { isSuccess, originalImage, faces };
    }

    return { isSuccess };
  }

  async function processData({ imageTitle, imagePath }) {
    setModalErrorMessage(undefined);

    const { isSuccess, originalImage, faces } = await fetchFaces(imagePath);
    if (isSuccess) {
      setModalImageTitle(imageTitle);
      setModalImage(originalImage);
      setModalFaceImages(faces);
      setModalHasData(true);
    } else {
      setModalErrorMessage(
        "Can't read the given image path. Make sure the path is correct."
      );
    }
  }

  async function resetData() {
    await setLocalData({});
    setModalImageTitle(null);
    setModalImage(null);
    setModalFaceImages(null);
    setModalErrorMessage(null);
    setModalHasData(false);

    setUIPageImage();
  }

  async function saveData(formData) {
    var composeData = {
      title: modalImageTitle,
      originalImage: modalImage,
      faces: [],
    };

    modalFaceImages.map((face, index) => {
      composeData.faces.push({ url: face, caption: formData["image" + index] });
    });

    setLocalData(composeData);
    setUIPageImageTitle(composeData.title);
    setUIPageImage(composeData.originalImage);
    setUIPageFaces(composeData.faces);
    setModalOpen(false);
  }

  return (
    <Fragment>
      {!hasData && (
        <Fragment>
          <Text format="markdown">**Face Detect**</Text>
          <Button
            text="Select Image"
            onClick={() => setModalOpen(true)}
          ></Button>
        </Fragment>
      )}
      {hasData && (
        <Fragment>
          <Text format="markdown">{`**${uiPageImageTitle}**`}</Text>
          <Image src={uiPageImage} alt=""></Image>
          <Button text="Reset" onClick={() => resetData()}></Button>
          <Table>
            {uiPageFaces.map((face) => {
              return (
                <Row>
                  <Cell>
                    <Image src={face.url} alt={face}></Image>
                  </Cell>
                  <Cell>
                    <Text>{face.caption}</Text>
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </Fragment>
      )}
      {isModelOpen && (
        <ModalDialog header="Face Detect" onClose={() => setModalOpen(false)}>
          {!modalHasData && (
            <Form onSubmit={processData} submitButtonText="Process">
              <TextField name="imageTitle" isRequired label="Title" />
              <TextField name="imagePath" isRequired label="Image Path" />
              {modalErrorMessage && <Text>{modalErrorMessage}</Text>}
            </Form>
          )}

          {modalHasData && (
            <Form onSubmit={saveData} submitButtonText="Save">
              <Table>
                {modalFaceImages.map((face, index) => {
                  return (
                    <Row>
                      <Cell>
                        <Image src={face} alt={face}></Image>
                      </Cell>
                      <Cell>
                        <TextField
                          name={`image${index}`}
                          label=""
                          isRequired
                          placeholder="Add name and details"
                        ></TextField>
                      </Cell>
                    </Row>
                  );
                })}
              </Table>
            </Form>
          )}
        </ModalDialog>
      )}
    </Fragment>
  );
};

export const run = render(<Macro app={<App />} />);

async function checkResponse(apiName, response) {
  if (!response.ok) {
    const message = `Error from ${apiName}: ${
      response.status
    } ${await response.text()}`;
    console.error(message);
  }
}
