import { unionByKey } from "utils/arrays";
import { supabase } from "utils/supabase";

import { useCallback, useRef, useState } from "react";

import AsyncCreatableSelect from "react-select/async-creatable";

export default function TagsInput({ value, onChange }) {
  const timeoutRef = useRef();
  const [loadedOptions, setLoadedOptions] = useState([]);
  const loadOptions = useCallback((query, callback) => {
    const fetchTags = async () => {
      const tagsRes = await supabase
        .from("tags_with_frequency")
        .select("*")
        .ilike("label", `${query}%`)
        .order("frequency", { ascending: false })
        .limit(5);
      if (tagsRes.error) {
        console.log(tagsRes.error);
      } else {
        const newOptions = tagsRes.data.map((tag) => ({
          value: tag.label,
          label: `${tag.label} (${tag.frequency})`,
        }));
        setLoadedOptions((options) => unionByKey("value")(options, newOptions));
        callback(newOptions);
      }
    };
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchTags, 200);
  }, []);

  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={value.map(
        (option) =>
          loadedOptions.find((other) => other.value === option) ?? {
            label: option,
            value: option,
          }
      )}
      onChange={(selectedOptions) => {
        onChange(selectedOptions.map((option) => option.value));
      }}
    />
  );
}
