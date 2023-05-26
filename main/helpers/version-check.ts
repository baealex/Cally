import { app, dialog, shell } from 'electron';
import axios from 'axios';

enum CompareResult {
    AIsBigger = 1,
    BIsBigger = -1,
    Same = 0

}

function versionCompare(a: string, b: string) {
    const pa = a.split('.');
    const pb = b.split('.');
    for (let i = 0; i < 3; i++) {
        const na = Number(pa[i]);
        const nb = Number(pb[i]);
        if (na > nb) return CompareResult.AIsBigger;
        if (nb > na) return CompareResult.BIsBigger;
        if (!isNaN(na) && isNaN(nb)) return CompareResult.AIsBigger;
        if (isNaN(na) && !isNaN(nb)) return CompareResult.BIsBigger;
    }
    return CompareResult.Same;
}

interface VersionCheckOptions {
    feedURL: string;
    openURL: string;
}

export default async function versionCheck({
    feedURL,
    openURL
}: VersionCheckOptions) {
    const res = await axios.get(feedURL);
    const version = res.data.version;

    if (versionCompare(version, app.getVersion()) === CompareResult.AIsBigger) {
        const dialogOpts = {
            type: 'info',
            buttons: ['예', '아니요'],
            title: '업데이트 알림',
            message: `새로운 버전(${version})이 있습니다.`,
            detail: '다운로드 페이지로 이동하시겠습니까?'
        };

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) {
                shell.openExternal(openURL);
            }
        });
    }
}