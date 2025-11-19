export default function ListingCard({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      {item.thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200" />
      )}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="font-medium line-clamp-1">{item.title}</div>
        <div className="text-sm text-gray-600 mt-1">
          {item.price} {item.currency}
        </div>
      </div>
    </div>
  );
}
