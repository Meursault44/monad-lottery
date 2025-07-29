import { useIsTogether } from 'react-together';
import { Spin } from 'antd';
export const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const isTogether = useIsTogether();

  if (!isTogether) {
    return (
      <div className="w-full h-screen flex items-center justify-center  text-white text-xl bg-[url(/LoaderBG.webp)] bg-center">
        <Spin fullscreen className={'scale-500 bottom-[10vh] '} />
        <div className={'text-[30px] w-[100%] text-center mt-5'}>The site hasn't loaded yet</div>
      </div>
    );
  }

  return <>{children}</>;
};
