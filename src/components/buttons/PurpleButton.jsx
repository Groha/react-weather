export default function PurpleButtton({children, isWeatherBlockVisible, changeWeatherBlockVisibility}) {
  return (
    <>
      <a href="#" className={`mx-10 first:ml-0 last:mr-0 w-full px-10 py-1 uppercase rounded border border-violet-200 hover:border-violet-400 transition-colors ${isWeatherBlockVisible ? 'pointer-events-auto bg-violet-200' : 'pointer-events-none bg-violet-100'}`} onClick={changeWeatherBlockVisibility}>{children}</a>
    </>
  );
}
