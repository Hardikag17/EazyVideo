import {
  NOTIFICATION_TYPE,
  Store as NotificationStore,
} from 'react-notifications-component';

export const NET_ID = 80001;

export const RPC_URL =
  process.env.ALCHEMY_POLYGON_MUMBAI_RPC_URL ??
  'https://rpc-endpoints.superfluid.dev/mumbai';

export function notify(type: NOTIFICATION_TYPE, data: string) {
  NotificationStore.addNotification({
    title: type === 'danger' ? 'Error' : 'Success',
    message: data,
    type: type,
    insert: 'top',
    container: 'top-right',
    dismiss: {
      duration: 1000,
      pauseOnHover: true,
      onScreen: true,
      showIcon: true,
    },
    animationIn: ['animate__animated animate__fadeIn'], // `animate.css v4` classes
    animationOut: ['animate__animated animate__fadeOut'],
  });
}

export async function fetchIpfs(url: string) {
  url = url.replace('ipfs://', 'https://opensea.mypinata.cloud/ipfs/');
  const data = await fetch(url);
  const metadata: IMetadata = await data.json();
  metadata.image = metadata.image.replace(
    'ipfs://',
    'https://opensea.mypinata.cloud/ipfs/'
  );
  return metadata;
}
