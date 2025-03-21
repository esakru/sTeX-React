import { deleteCookie, getCookie } from '@stex-react/utils';
import axios, { AxiosError } from 'axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const lmsServerAddress = process.env.NEXT_PUBLIC_LMS_URL;

export type SmileyType =
  | 'smiley-2'
  | 'smiley-1'
  | 'smiley0'
  | 'smiley1'
  | 'smiley2';

export type SmileyLevel = -2 | -1 | 0 | 1 | 2;
export const ALL_SMILEY_LEVELS: SmileyLevel[] = [-2, -1, 0, 1, 2];

export function smileyToLevel(smiley?: SmileyType): SmileyLevel | undefined {
  if (!smiley) return undefined;
  if (smiley === 'smiley-2') return -2;
  if (smiley === 'smiley-1') return -1;
  if (smiley === 'smiley0') return 0;
  if (smiley === 'smiley1') return 1;
  if (smiley === 'smiley2') return 2;
  return -2;
}

export interface NumericCognitiveValues {
  Remember?: number;
  Understand?: number;
  Apply?: number;
  Analyse?: number;
  Evaluate?: number;
  Create?: number;
}
export interface SmileyCognitiveValues {
  Remember?: SmileyType;
  Understand?: SmileyType;
  Apply?: SmileyType;
  Analyse?: SmileyType;
  Evaluate?: SmileyType;
  Create?: SmileyType;
}

export interface GenericCognitiveValues {
  Remember?: number | SmileyType;
  Understand?: number | SmileyType;
  Apply?: number | SmileyType;
  Analyse?: number | SmileyType;
  Evaluate?: number | SmileyType;
  Create?: number | SmileyType;
}

export enum BloomDimension {
  Remember = 'Remember',
  Understand = 'Understand',
  Apply = 'Apply',
  Analyse = 'Analyse',
  Evaluate = 'Evaluate',
  Create = 'Create',
}
export const ALL_DIMENSIONS = [
  BloomDimension.Remember,
  BloomDimension.Understand,
  BloomDimension.Apply,
  BloomDimension.Analyse,
  BloomDimension.Evaluate,
  BloomDimension.Create,
];

export interface LMSEvent {
  type: 'i-know' | 'question-answered' | 'self-assessment-5StepLikertSmileys';
  URI: string; // The uri that "i-know" or the question answered filename.
  answers?: any; // The answer of the question. Type TBD.
  values?: GenericCognitiveValues;
}

export interface UserInfo {
  userId: string;
  givenName: string;
  sn: string;
  fullName: string;
}

export function getAccessToken() {
  return getCookie('access_token');
}

const FAKE_USER_DEFAULT_COMPETENCIES: { [id: string]: string[] } = {
  blank: [],
  abc: ['http://mathhub.info/smglom/sets/mod?set'],
  joy: ['http://mathhub.info/smglom/complexity/mod?timespace-complexity'],
  sabrina: [
    'http://mathhub.info/smglom/complexity/mod?timespace-complexity',
    'http://mathhub.info/smglom/sets/mod?formal-language',
    'http://mathhub.info/smglom/mv/mod?structure?mathematical-structure',
  ],
  anushka: [
    'http://mathhub.info/smglom/mv/mod?structure?mathematical-structure',
  ],
};

export function isLoggedIn() {
  return !!getAccessToken();
}

export function logout() {
  deleteCookie('access_token');
  location.reload();
}

export function logoutAndGetToLoginPage() {
  deleteCookie('access_token');
  const redirectUrl = `/login?target=${encodeURIComponent(
    window.location.href
  )}`;
  window.location.replace(redirectUrl);
}

export function login() {
  deleteCookie('access_token');
  location.reload();
}

export function getAuthHeaders() {
  const token = getAccessToken();
  if (!token) return undefined;
  return { Authorization: 'JWT ' + token };
}

export function loginUsingRedirect(returnBackUrl?: string) {
  if (!returnBackUrl) returnBackUrl = window.location.href;

  const redirectUrl = `${lmsServerAddress}/login?target=${encodeURIComponent(
    returnBackUrl
  )}`;

  window.location.replace(redirectUrl);
}

export function fakeLoginUsingRedirect(
  fakeId: string,
  name: string | undefined,
  returnBackUrl: string | undefined,
  persona?: string
) {
  if (!returnBackUrl) returnBackUrl = window.location.href;
  fakeId = fakeId.replace(/\W/g, '');
  const encodedReturnBackUrl = encodeURIComponent(returnBackUrl);
  const target = persona
    ? encodeURIComponent(
        window.location.origin +
          `/reset-and-redirect?redirectPath=${encodedReturnBackUrl}&persona=${persona}`
      )
    : encodedReturnBackUrl;
  const n = name || fakeId;

  const redirectUrl =
    `${lmsServerAddress}/fake-login?fake-id=${fakeId}&target=${target}` +
    (name ? `&name=${n}` : '');

  window.location.replace(redirectUrl);
}

async function lmsRequest(
  apiUrl: string,
  requestType: string,
  defaultVal: any,
  data?: any,
  inputHeaders?: any
) {
  const headers = inputHeaders ? inputHeaders : getAuthHeaders();
  if (!headers) {
    return Promise.resolve(defaultVal);
  }
  try {
    const fullUrl = `${lmsServerAddress}/${apiUrl}`;
    const resp =
      requestType === 'POST'
        ? await axios.post(fullUrl, data, { headers })
        : await axios.get(fullUrl, { headers });
    return resp.data;
  } catch (err) {
    const error = err as Error | AxiosError;
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        logoutAndGetToLoginPage();
      }
    }
  }
}

function cleanupNumericCognitiveValues(
  dim: NumericCognitiveValues
): NumericCognitiveValues {
  return {
    Remember: +(dim.Remember || 0),
    Understand: +(dim.Understand || 0),
    Apply: +(dim.Apply || 0),
    Analyse: +(dim.Analyse || 0),
    Create: +(dim.Create || 0),
  };
}

function cleanupSmileyCognitiveValues(
  dim: SmileyCognitiveValues
): SmileyCognitiveValues {
  const defaultSmiley = 'smiley-2';
  return {
    Remember: dim.Remember || defaultSmiley,
    Understand: dim.Understand || defaultSmiley,
    Apply: dim.Apply || defaultSmiley,
    Analyse: dim.Analyse || defaultSmiley,
    Create: dim.Create || defaultSmiley,
  };
}

export async function getUriWeights(
  URIs: string[]
): Promise<NumericCognitiveValues[]> {
  const resp = await lmsRequest('lms/output/multiple', 'POST', null, { URIs });
  if (!resp?.model) return new Array(URIs.length).fill({});
  const model: { URI: string; values: NumericCognitiveValues }[] = resp.model;
  const compMap = new Map<string, NumericCognitiveValues>();
  model.forEach((c) => {
    compMap.set(c.URI, cleanupNumericCognitiveValues(c.values));
  });
  return URIs.map(
    (URI) => compMap.get(URI) || cleanupNumericCognitiveValues({})
  );
}

export async function getUriSmileys(
  URIs: string[],
  inputHeaders?: any
): Promise<SmileyCognitiveValues[]> {
  const resp = await lmsRequest(
    'lms/output/multiple',
    'POST',
    null,
    {
      URIs,
      'special-output': '5StepLikertSmileys',
    },
    inputHeaders
  );
  if (!resp?.model) return new Array(URIs.length).fill({});
  const model: { URI: string; values: SmileyCognitiveValues }[] = resp.model;
  const compMap = new Map<string, SmileyCognitiveValues>();
  model.forEach((c) => {
    compMap.set(c.URI, cleanupSmileyCognitiveValues(c.values));
  });
  return URIs.map(
    (URI) => compMap.get(URI) || cleanupSmileyCognitiveValues({})
  );
}

export async function reportEvent(event: LMSEvent) {
  return await lmsRequest('lms/input/events', 'POST', {}, event);
}

export async function getAllMyData() {
  return await lmsRequest('/lms/output/all_my_data', 'POST', {}, {});
}

export async function purgeAllMyData() {
  return await lmsRequest('/lms/input/events', 'POST', {}, { type: 'purge' });
}

export async function resetFakeUserData(persona: string) {
  const userInfo = await getUserInfo();
  const userId = userInfo?.userId;
  if (!userId || !userId.startsWith('fake')) return;
  if (!(persona in FAKE_USER_DEFAULT_COMPETENCIES)) {
    alert(`No defaults found for ${persona}`);
    return;
  }
  const URIs = FAKE_USER_DEFAULT_COMPETENCIES[persona];
  await purgeAllMyData();
  for (const URI of URIs) {
    await reportEvent({ type: 'i-know', URI });
  }
  alert(`User reset: ${userId} with persona: ${persona}`);
}

let cachedUserInfo: UserInfo | undefined = undefined;
export async function getUserInfo() {
  if (!cachedUserInfo) {
    const v = await lmsRequest('getuserinfo', 'GET', undefined);
    if (!v) return undefined;
    cachedUserInfo = {
      userId: v['user_id'],
      givenName: v['given_name'],
      sn: v['sn'],
      fullName: `${v['given_name']} ${v['sn']}`,
    };
  }
  return cachedUserInfo;
}
