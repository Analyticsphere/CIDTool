import { REDIRECT_URI, REDIRECT_URI_LOCAL } from '../config.js';
import { toBase64, appState, isLocal } from './common.js';
import { OWNER, REPO, PATH } from '../config.js';

export const getUserDetails = async () => {
    
    try {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/ghauth?api=getUser`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('gh_access_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export const getAccessToken = async (code) => {

    let uri;
    let local = isLocal();

    if (local) {
        uri = REDIRECT_URI_LOCAL;
    }
    else {
        uri = REDIRECT_URI;
    }

    try {
        const response = await fetch(`https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/ghauth?api=accessToken${local ? '&environment=dev' : ''}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                redirect: uri
            })
        });

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export const addFile = async (path, content) => {
    
    try {
        const response = await fetch('https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/ghauth?api=addFile', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('gh_access_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                owner: OWNER,
                repo: REPO,
                path: PATH + '/' + path,
                message: 'file added via CID Tool',
                content: toBase64(content)
            })
        });
    
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}

export const updateFile = async (path, content, sha) => {

    try {
        const response = await fetch('https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/ghauth?api=updateFile', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('gh_access_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                owner: OWNER,
                repo: REPO,
                path,
                sha,
                message: 'file modified via CID Tool',
                content: toBase64(content)
            })
        });
    
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }

}

export const deleteFile = async () => {


}

export const getFiles = async (fileName) => {

    try {
        const url = `https://us-central1-nih-nci-dceg-connect-dev.cloudfunctions.net/ghauth?api=getFiles&owner=${OWNER}&repo=${REPO}&path=${PATH}${fileName ? '/' + fileName : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('gh_access_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error(error);
    }
}