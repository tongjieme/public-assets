import DataGrid from "../Comp/DataGrid.jsx";
import Papapaser from "papaparse"

import { InboxOutlined } from '@ant-design/icons';
import {message, Tabs, Upload} from 'antd';
import {useState} from "react";
import Home from "./Home.jsx";
const { Dragger } = Upload;

export default function (){
    let [Files, setFiles] = useState([]);
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: function (){
            return false
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
            for (let i = 0 ; i < e.dataTransfer.files.length; i++) {
                let file = e.dataTransfer.files[i]
                file.text().then(function (str){
                    setFiles(function (prev){
                        return [...prev,{fileName: file.name, content: str}]
                    })
                })
            }
        },
    };

    function getItems() {
        return Files.map((f, index) => {
            return {
                label: f.fileName,
                children: <CsvFileBrowser content={f.content}></CsvFileBrowser>,
                key: (index + 1) + ""
            }
        })
    }

    return <div>


        <Tabs defaultActiveKey="1" items={getItems()} onChange={() => {}} />
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>
    </div>
}

function CsvFileBrowser({name, content}) {
    name = name || ""
    content = content || ""

    let dataArray = []

    try {
        let parse = JSON.parse(content);
        if(Array.isArray(parse)) {
            dataArray = parse
        }
    } catch (e) {
        try {
            let parse1 = Papapaser.parse(content, {
                header: true,
                dynamicTyping: true,
            });
            dataArray = parse1.data
        } catch (e) {

        }

    }

    return <DataGrid data={dataArray}></DataGrid>
}