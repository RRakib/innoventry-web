import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as FileSaver from "file-saver";

@Injectable()
export class DownloadService {

    constructor(private _snackBar: MatSnackBar) {}

    // application/octet-stream, application/pdf
    public downloadFileFromURL(url : string, fileType: string, fileName?: string) : void{
        this._snackBar.open("Download is in progress",'Close', {
            duration: 2000
        });
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);          
        xhr.setRequestHeader('X-Authorization','Bearer ' + localStorage.getItem('authToken'));
        xhr.send("id=100");
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200){                
                var file = new Blob([this.response], {type: fileName });
                FileSaver.saveAs(file, fileName);
            } 
        }
    }
}