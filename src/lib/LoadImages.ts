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
  constructor() {}
  private static async load(src: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = src;
    try {
      await img.decode();
    } catch (error) {
      throw new Error(
        `画像のデコードに失敗しました: ${src} - ${
          error instanceof Error ? error.message : '不明なエラー'
        }`
      );
    }
    return img;
  }

  public static async loadImages(
    list: string[],
    callback?: (images: HTMLImageElement[]) => void
  ): Promise<HTMLImageElement[]> {
    const images = await Promise.all(list.map((src) => this.load(src)));
    if (typeof callback === 'function') {
      callback(images);
    }
    return images;
  }
}
