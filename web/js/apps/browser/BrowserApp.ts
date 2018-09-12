import {Logger} from '../../logger/Logger';
import {isPresent} from '../../Preconditions';
import {WebContentsNotifiers} from '../../electron/web_contents_notifier/WebContentsNotifiers';
import {BrowserAppEvents} from './BrowserAppEvents';

const log = Logger.create();

export class BrowserApp {

    public start(): void {

        // FIXME: wait until we get document dom ready and web contents dom ready.

        // content.addEventListener('dom-ready', async () => {

        const linkInputElement = <HTMLInputElement> document.querySelector("#link")!;

        linkInputElement.addEventListener('keypress', (event) => this.onLinkKeyPress(event));

        const captureButtonElement = <HTMLInputElement> document.querySelector("#capture")!;

        captureButtonElement.addEventListener('click', (event) => this.onTriggerCapture());

        log.info("started");

    }


    private onLinkKeyPress(event: Event) {

        if (event instanceof KeyboardEvent && event.which === 13) {

            console.log("GOT enter");

            const element = <HTMLInputElement> document.querySelector("#link")!;

            this.onLinkChange(element.value);

        }

    }

    private onLinkChange(value: string) {

        if (isPresent(value) && ! value.startsWith("http:") && ! value.startsWith("https:")) {
            log.debug("Not a URL: " + value);
            return;
        }

        log.debug("Starting capture on URL: " + value);

        // const webContentsId = this.getWebContentsId();
        // log.info("Working with web contents: " + webContentsId);
        // CaptureClient.startCapture(value, webContentsId);

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.PROVIDE_URL, value);

    }


    private onTriggerCapture() {

        WebContentsNotifiers.dispatchEvent(BrowserAppEvents.TRIGGER_CAPTURE, {});

    }

    private getWebContentsId() {

        const content = <Electron.WebviewTag> document.querySelector("#content")!;
        const webContents = content.getWebContents();
        return webContents.id;

    }

}