import React, { Component, useEffect } from 'react';
import uploadcare from 'uploadcare-widget';
import { Widget } from "@uploadcare/react-widget";
import styles from '../../components/imageupload/style.ImageUploader.module.scss'


const ImageUploader = ({ onImageUpload }) => {

    useEffect(() => {
        const widget = uploadcare.Widget('[role=uploadcare-uploader]');
        widget.onUploadComplete(info => {
            // Get CDN URL from file information
            const cdnUrl = info.cdnUrl;
            console.log(cdnUrl);
            // Call the callback function to update the imageURL in the parent component
            onImageUpload(cdnUrl);
        });
    }, [onImageUpload]);

    return (
        <div>
            <input
                
                type="hidden"
                role="uploadcare-uploader"
                name="my_file"
                id="uploadcare-file"
                publicKey='a4e22236726c655962b5'
                tabs='file url'
                previewStep='true'

            />
        </div>
    );
};

export default ImageUploader;

// import { useState, useCallback, useRef, useEffect } from "react";
// import * as LR from "@uploadcare/blocks";
// import  styles from "../../components/imageupload/style.ImageUploader.module.scss";
// import { PACKAGE_VERSION } from "@uploadcare/blocks";

// LR.registerBlocks(LR);

// function ImageUploader() {
//   const dataOutputRef = useRef();
//   const configRef = useRef();
//   const [files, setFiles] = useState([]);

//   const handleUploaderEvent = useCallback((e) => {
//     const { data } = e.detail;
//     setFiles(data);
//   }, []);

//   useEffect(() => {
//     if (!configRef.current) {
//       return;
//     }
//     configRef.current.metadata = {
//       foo: "bar",
//     };
//   }, []);

//   return (
//     <div className={styles.wrapper}>
//       <lr-config
//         ctx-name="my-uploader"
//         pubkey="a4e22236726c655962b5"
//         maxLocalFileSizeBytes={10000000}
//         multiple={false}
//         imgOnly={true}
//         sourceList="local, url, camera, gdrive"
//         useCloudImageEditor={false}
//         ref={configRef}
//       ></lr-config>

//       <lr-file-uploader-regular
//         css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.25.0/web/lr-file-uploader-regular.min.css"
//         ctx-name="my-uploader"
//         className={styles.myconfig}
//       >
//       </lr-file-uploader-regular>

//       <div className={styles.output}>
//         {files.map((file) => (
//           <img
//             key={file.uuid}
//             src={`https://ucarecdn.com/${file.uuid}/${file.cdnUrlModifiers || ""
//               }-/preview/-/scale_crop/400x400/`}
//             width="200"
//             alt="Preview"
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ImageUploader;

