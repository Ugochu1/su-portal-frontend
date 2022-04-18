import Image from "next/image";

function Logo() {
  return (
    <div className="flex justify-center items-center mb-4">
      <div>
        <div className="text-3xl font-semibold mr-1 text-green-600 font-fredoka tracking-tight"></div>
      </div>
      <div>
        <Image src="/pngkit_scripture-png_1028698.png" alt="SU Logo" width={40} height={40}/>
      </div>
    </div>
  )
}

export default Logo;