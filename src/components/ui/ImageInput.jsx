import { fileToImage, compressImage } from "utils/images";
import cx from "classnames";

import React, { useCallback, useRef } from "react";

import Camera from "components/icons/Camera";
import Cross from "components/icons/Cross";
import Button from "./Button";

export function HiddenImageInput({ compression, onChange }) {
  const _onChange = useCallback(
    async (file) => {
      const image = await fileToImage(file);
      const compressedImage = await compressImage(image, compression);
      onChange({ file, data: compressedImage });
    },
    [compression, onChange]
  );

  return (
    <input
      className="hidden absolute inset-0"
      type="file"
      accept="image/*"
      onChange={(event) => {
        if (event.target.files.length === 1) {
          _onChange(event.target.files[0]);
        }
      }}
    />
  );
}

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

  return (
    <div className="space-y-4">
      <div className={cx("relative", className)}>
        <label
          ref={containerRef}
          className={cx(
            "relative block flex-shrink-0 overflow-hidden",
            { "cursor-pointer": !disabled },
            className
          )}
          {...props}
        >
          {value ? (
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={value}
            />
          ) : (
            disabled !== true && (
              <Camera className="absolute inset-0 m-auto h-4" />
            )
          )}
          <HiddenImageInput
            onChange={onChange}
            compression={compression}
            disabled={disabled}
          />
        </label>
        {value && (
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
        )}
      </div>
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        <span className="text-xs text-gray-500">Click to upload an image</span>
      )}
    </div>
  );
}
