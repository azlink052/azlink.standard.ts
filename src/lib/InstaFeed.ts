/**
 * Instagramのフィードをタイル表示
 * 参考： http: //wordpress.azlink.biz/2020/0409120000.html
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2025.05.25
 *
 * @param {*} $options
 * @returns
 */
interface Options {
  igID: string;
  token: string;
  count: number;
  version: string;
  elem: string;
  onComplete: any;
}
export class InstaFeed {
  private options: Options;
  private app_url: string;

  constructor({
    igID = '', // InstagramビジネスアカウントID
    token = '', // トークン
    count = 5, // 最大表示件数
    version = '10.0', // Graph API バージョン
    elem = '', // セレクタ
    onComplete = false, // 終了後コールバック
  }: Partial<Options> = {}) {
    this.options = {
      igID: igID,
      token: token,
      count: count,
      version: version,
      elem: elem,
      onComplete: onComplete,
    };

    if (!this.options.igID || !this.options.token) {
      this.die();
    }

    this.app_url = `https://graph.facebook.com/v${this.options.version}/${this.options.igID}?fields=name%2Cmedia.limit(${this.options.count})%7Bcaption%2Clike_count%2Cmedia_url%2Cpermalink%2Cmedia_type%2Cthumbnail_url%2Ctimestamp%2Cusername%7D&access_token=${this.options.token}`;

    this.run();
  }
  async run(): Promise<void> {
    const response = await fetch(this.app_url);
    const res = await response.json();
    // console.log(res);
    if (res.media.data.length <= 0) return;

    if (this.options.elem) {
      let src = '';
      const insta = res.media.data;
      for (const item of insta) {
        const thumb =
          item.media_type !== 'VIDEO' ? item.media_url : item.thumbnail_url;
        src += `<div class="instaItem"><a href="${item.permalink}" target="_blank"><img src="${thumb}"></a></div>`;
      }
      document
        .querySelector(this.options.elem)
        .insertAdjacentHTML('beforeend', src);
    }

    if (
      this.options.onComplete &&
      typeof this.options.onComplete === 'function'
    ) {
      this.options.onComplete(response);
    }
    // console.log('resolve');
    // return 'resolve';
  }
  destroy(): void {
    document.querySelector(this.options.elem).innerHTML = '';
  }
  die(): boolean {
    this.destroy();
    return false;
  }
}
