import imgUdlap1 from "./94454e9a7e3e91be5322a669fe39012d8be17a6a.png";

function Frame() {
  return <div className="absolute bg-white left-[413px] size-px top-[563px]" />;
}

export default function LoginAdministrador() {
  return (
    <div className="bg-[#f1f1f1] relative size-full" data-name="Login Administrador">
      <div className="absolute left-[159px] size-[255px] top-[71px]" data-name="UDLAP 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUdlap1} />
      </div>
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[286.5px] not-italic text-[32px] text-black text-center top-[338px] w-[229px]">Iniciar Sesión</p>
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[140.5px] not-italic text-[20px] text-black text-center top-[388px] w-[229px]">Usuario / ID</p>
      <div className="absolute bg-white h-[51px] left-[70px] top-[421px] w-[433px]" />
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[128.5px] not-italic text-[#737373] text-[15px] text-center top-[436px] w-[229px]">ID Estudiante</p>
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[140.5px] not-italic text-[20px] text-black text-center top-[490px] w-[229px]">Contraseña</p>
      <div className="absolute bg-white h-[51px] left-[70px] top-[517px] w-[433px]" />
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[114.5px] not-italic text-[#737373] text-[15px] text-center top-[538px] w-[229px]">*********</p>
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[normal] left-[428.5px] not-italic text-[#737373] text-[16px] text-center top-[580px] w-[229px]">Olvidé mi contraseña</p>
      <div className="absolute bg-[#f48a32] h-[53px] left-[183px] top-[634px] w-[206px]" />
      <p className="-translate-x-1/2 absolute font-['DM_Serif_Text:Regular',sans-serif] h-[20px] leading-[22px] left-[286.5px] not-italic text-[20px] text-center text-white top-[651px] w-[229px]">Ingresar</p>
      <Frame />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Lexend:Bold',sans-serif] font-bold h-[28px] justify-center leading-[0] left-[252px] text-[#f48a32] text-[20px] top-[27px] tracking-[-0.5px] w-[74px]">
        <p className="leading-[28px]">UDLAP</p>
      </div>
    </div>
  );
}