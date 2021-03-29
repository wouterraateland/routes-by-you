import { supabase } from "utils/supabase";

import { useEffect, useRef, useState } from "react";

import Avatar from "components/ui/Avatar";
import Button from "components/ui/Button";
import Field from "components/ui/Field";
import FlyOut from "components/ui/FlyOut";
import Input from "components/ui/Input";

import Cross from "components/icons/Cross";

export default function LocationField({ route, setRoute }) {
  const [suggestedLocations, setSuggestedLocations] = useState([]);

  const location = suggestedLocations.find(
    (location) => location.id === route.location_id
  );
  const suggestionsOriginRef = useRef();
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (route.location_id) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .eq("id", route.location_id);
        setSuggestedLocations(data || []);
      } else if (route.location_string) {
        const { data } = await supabase
          .from("locations")
          .select("*")
          .ilike("name", `%${route.location_string}%`);
        setSuggestedLocations(data || []);
      } else {
        setSuggestedLocations([]);
      }
    };

    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [route.location_id, route.location_string]);

  return (
    <Field label="Location">
      <div ref={suggestionsOriginRef}>
        {route.location_id && location ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {location.logo && (
                <img
                  src={location.logo}
                  className="w-8 h-8 rounded-full shadow-md"
                  alt={location.name}
                />
              )}
              <span>{location.name}</span>
            </div>
            <Button
              onClick={() =>
                setRoute((route) => ({ ...route, location_id: null }))
              }
            >
              <Cross className="h-4" />
            </Button>
          </div>
        ) : (
          <Input
            required
            value={route.location_string}
            onChange={(event) =>
              setRoute((route) => ({
                ...route,
                location_string: event.target.value,
              }))
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 50)}
          />
        )}
      </div>
      <FlyOut
        originRef={suggestionsOriginRef}
        isOpen={!route.location_id && suggestedLocations.length > 0 && focus}
        onClose={() => {}}
        persistOnClick
      >
        {suggestedLocations.map((location) => (
          <Button
            key={location.id}
            className="flex w-full items-center space-x-2 p-2 text-left truncate"
            bgColor="white"
            onClick={() =>
              setRoute((route) => ({
                ...route,
                location_id: location.id,
              }))
            }
          >
            <Avatar
              src={location.logo}
              alt={location.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{location.name}</span>
          </Button>
        ))}
      </FlyOut>
    </Field>
  );
}
