import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import styles from './style.quillTextEditor.module.scss'

function TextEditor({ onContentChange }) {
    const [text, setText] = useState('');

    const handleEditorChange = (content) => {
        setText(content);
        onContentChange(content); // Call the callback to update the parent component's state
    };

    return (
        <div>
            <ReactQuill
                value={text}
                onChange={handleEditorChange}
                modules={TextEditor.modules}
                formats={TextEditor.formats}
                style={{ height: '150px', marginBottom: '80px' }}
                className={styles.commentInputField}
            />
        </div>
    );
}

// Define the available modules and formats
TextEditor.modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ],
};

TextEditor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block"
];

export default TextEditor;
