/**
 * シンプルなcookie管理
 * @category 	Application of AZLINK.
 * @author 		Norio Murata <nori@azlink.jp>
 * @copyright 2010- AZLINK. <https://azlink.jp>
 * @final 		2023.03.13
 */
interface CookieObj {
  key: string;
  value: string;
}
interface CookieOption {
  path: string;
  domain: string;
  'max-age': number;
  expires: number | string;
  secure: boolean;
}
export class SimpleCookie {
  private raw: string;
  private cParam: CookieObj[];

  constructor() {
    this.raw = document.cookie;
    // console.log(this.raw);
    this.cParam = [];
    const p = this.raw.split(';');
    // console.log(p);
    // console.log(this.cParam);
    p.forEach((v, i) => {
      const obj = v.split('=');
      console.log(obj);
      this.cParam.push({
        key: obj[0],
        value: obj[1],
      });
    });
  }
  /**
   * 生のcookieを取得
   * @return {string} 生のcookieを返す
   */
  getRaw(): string {
    // 生のcookieを返す
    return this.raw;
  }
  /**
   * 指定したkeyのcookieの値を取得
   * @param {string} key 取得したいcookieのkey
   * @return {string | boolean} 取得できた場合は値を返し、失敗でfalse
   */
  get(key: string): string | boolean {
    const v = this.cParam.filter((item) => {
      // console.log(item.key.trim());
      return item.key.trim() === key;
    });
    if (v.length) {
      return v[0].value;
    } else {
      return false;
    }
  }
  /**
   * 指定したkeyのcookieを削除
   * @param {string} key 削除したいcookieのkey
   * @return {boolean} 成功でtrue 失敗でfalse
   */
  delete(key: string): boolean {
    const v = this.get(key);
    if ((document.cookie = `${key}=${encodeURIComponent(v)}; max-age=0`)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 指定したkey: value のcookieを更新
   * @param {string} key 更新したいcookieのkey
   * @param {string} value 更新したいcookieの値
   * @param {CookieOption} option オプションパラメータ path / domain / max-age / expires / secure
   * @return {boolean} 成功でtrue 失敗でfalse
   */
  set(key: string, value: string, option: Partial<CookieOption> = {}): boolean {
    if (!key || !value) return false;
    let c = `${key}=${encodeURIComponent(value)};`;
    if (Object.keys(option).length) {
      Object.keys(option).forEach((key) => {
        c += ` ${key}=${option[key]};`;
      });
    }
    if ((document.cookie = c)) {
      return true;
    } else {
      return false;
    }
  }
}
