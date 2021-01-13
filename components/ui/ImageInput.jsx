import { fileToImage, compressImage } from "utils/images";
import cx from "classnames";

import React, { useCallback, useRef } from "react";

import Camera from "components/icons/Camera";
import Cross from "components/icons/Cross";
import Button from "./Button";

const HiddenImageInput = ({ onChange }) => (
  <input
    className="hidden absolute inset-0"
    type="file"
    accept="image/*"
    onChange={(event) => {
      if (event.target.files.length === 1) {
        onChange(event.target.files[0]);
      }
    }}
  />
);

export default function ImageInput({
  value,
  error,
  onChange,
  onDelete,
  disabled,
  compression,
  className,
  ...props
}) {
  const containerRef = useRef(null);

  const _onChange = useCallback(
    async (file) => {
      const image = await fileToImage(file);
      const compressedImage = await compressImage(image, compression);
      onChange({ file, data: compressedImage });
    },
    [compression, onChange]
  );

  return (
    <div className="space-y-4">
      <label
        ref={containerRef}
        className={cx(
          "block relative flex-shrink-0",
          { "cursor-pointer": !disabled },
          className
        )}
        {...props}
      >
        {value ? (
          <>
            <img
              className={cx(
                "absolute inset-0 w-full h-full object-cover",
                className
              )}
              src={value}
            />
            <Button
              type="button"
              className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
              onClick={async (event) => {
                event.stopPropagation();
                event.preventDefault();
                await onDelete();
              }}
              disabled={disabled}
              hint="Delete image"
            >
              <Cross className="h-4" />
            </Button>
          </>
        ) : (
          disabled !== true && (
            <Camera className="absolute inset-0 m-auto h-4" />
          )
        )}
        <HiddenImageInput onChange={_onChange} disabled={disabled} />
      </label>
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        <span className="text-xs text-gray-500">Click to upload an image</span>
      )}
    </div>
  );
}
