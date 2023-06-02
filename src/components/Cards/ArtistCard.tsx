import Image from "next/image"

export const ArtistCard = ({ name, description, image, genre }: { name: string, description: string, image: string, genre: string }) => {
  return (
    <a href="#" className="group relative block bg-black">
      <Image
        alt="Developer"
        width="400"
        height="400"
        src={image}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />

      <div className="relative p-4 sm:p-6 lg:p-8">
        <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
          {genre}
        </p>

        <p className="text-xl font-bold text-white sm:text-2xl">{name}</p>

        <div className="mt-32 sm:mt-48 lg:mt-64">
          <div
            className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
          >
            <p className="text-sm text-white">
              {description}
            </p>
          </div>
        </div>
      </div>
    </a>
  )
}