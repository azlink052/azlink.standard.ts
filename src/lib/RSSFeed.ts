import axios from 'axios';
import axiosJsonpAdapter from 'axios-jsonp';
/**
 * RSSフィードを記事配列として取得
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2021.06.27
 *
 * @param {*} $options
 * @returns
 */
interface Options {
  app_url: string;
  feed_url: string;
  count: number;
  callback: string;
  onComplete: any;
}
export default class RSSFeed {
  private options: Options;

  constructor({
    app_url = 'https://azlink052.sakura.ne.jp/common/apps/getFeedJson.fix.20220214.php',
    feed_url = '',
    count = 5,
    callback = 'result',
    onComplete = false,
  }: Partial<Options> = {}) {
    this.options = {
      app_url: app_url,
      feed_url: feed_url,
      count: count,
      callback: callback,
      onComplete: typeof onComplete === 'function' ? onComplete : false,
    };

    if (this.options.feed_url) {
      this.run();
    } else {
      this.die();
    }
  }
  run() {
    window[this.options.callback] = (json) => {
      // return json;
      if (this.options.onComplete) this.options.onComplete(json);
    };
    // console.log('run')
    axios.get(this.options.app_url, {
      adapter: axiosJsonpAdapter,
      // @ts-ignore　callbackParamName　が存在しない
      callbackParamName: this.options.callback,
      params: {
        url: this.options.feed_url,
        count: this.options.count,
        callback: this.options.callback,
      },
    });
  }
  die(): boolean {
    return false;
  }
}
