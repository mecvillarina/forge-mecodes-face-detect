# Forge - Face Detect

This project contains a Forge app written in Typescript that extracts faces from an image and let us add some caption/description for each extracted image faces. This only works on Confluence. This app used an 3rd Party API. If you're interested what's behind the 3rd Party API, the project repository can be found [here](https://google.com).

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Build and deploy your app by running:

```
forge deploy
```

- Install your app in an Atlassian site by running:

```
forge install
```

- Develop your app by running `forge tunnel` to proxy invocations locally:

```
forge tunnel
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.
- Use the `manifest.yml` for the title of the app
- In any confluence page, you can add the macro by typing `/forge-mecodes-face-detect`.

## Sample Working Output

- Step 1: The default UI when you first added the macro.

  ![alt text](https://github.com/mecvillarina/forge-mecodes-face-detect/raw/master/assets/ss1.PNG "Screenshot 1")

- Step 2: The popup will appear when you click the `Select Image` button. It will require you to add title caption and image URL path. For the Image Path, it is manual for now since Forge UI doesn't have a FilePicker yet. Click the `Process` button to process.

  ![alt text](https://github.com/mecvillarina/forge-mecodes-face-detect/raw/master/assets/ss2.PNG "Screenshot 2")

- Step 3: After the image has been processed. It will display the list of faces. You are required to add some details for each image. Click the `Save` button to save the information.

  ![alt text](https://github.com/mecvillarina/forge-mecodes-face-detect/raw/master/assets/ss3.PNG "Screenshot 3")

- Step 4: After saving the details, the end result will display on screen with the title caption, the original image and the extracted face images and its caption. You have the option to try it again by clicking the `Reset` button as shown in the screenshot below.

  ![alt text](https://github.com/mecvillarina/forge-mecodes-face-detect/raw/master/assets/ss4.PNG "Screenshot 4")
