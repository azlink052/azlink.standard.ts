/**
 * 非同期で画像の読み込み
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2025.05.16
 *
 * @param {string[]} list 画像のURLリスト
 * @param {function} callback 読み込み完了後のコールバック関数
 * @return {Promise<HTMLImageElement[]>} 画像配列のPromise
 */
export class LoadImages {
  private static async load(src: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = src;
    await img.decode();
    return img;
  }

  public static async loadImages(
    list: string[],
    callback?: () => void
  ): Promise<HTMLImageElement[]> {
    const images = await Promise.all(list.map((src) => this.load(src)));
    if (typeof callback === 'function') {
      callback();
    }
    return images;
  }
}
