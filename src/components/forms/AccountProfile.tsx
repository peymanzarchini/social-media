"use client";

import * as z from "zod";
import { useForm, Controller } from "react-hook-form";
import { userValidationSchema } from "@/utils/validation/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { isBase64Image } from "@/utils";
import { useUploadThing } from "@/utils/uploadthing";

interface ProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: ProfileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof userValidationSchema>>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userValidationSchema>) => {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <form className="flex flex-col justify-start gap-10" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="profile_photo"
        render={({ field }) => (
          <div className="flex items-center gap-4">
            <div className="account-form_image-label">
              {field.value ? (
                <Image
                  src={field.value}
                  alt="profile_icon"
                  width={96}
                  height={96}
                  priority
                  className="rounded-full object-contain"
                />
              ) : (
                <Image src={"/assets/profile.svg"} alt="profile_icon" width={24} height={24} />
              )}
            </div>
            <div className="flex-1 text-base-semibold text-gray-200">
              <input
                type="file"
                accept="image/*"
                placeholder="Add profile photo"
                className="account-form_image-input"
                onChange={(e) => handleImage(e, field.onChange)}
              />
            </div>
          </div>
        )}
      />
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <div className="flex w-full flex-col gap-3">
            <div className="text-base-semibold text-light-2">Name</div>
            <div>
              <input type="text" className="account-form_input no-focus w-full" {...field} />
            </div>
          </div>
        )}
      />
      {errors.name && <p className="text-red-500">{`${errors.name}`}</p>}

      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <div className="flex w-full flex-col gap-3">
            <div className="text-base-semibold text-light-2">Username</div>
            <div>
              <input type="text" className="account-form_input no-focus w-full" {...field} />
            </div>
          </div>
        )}
      />

      {errors.username && <p className="text-red-500">{`${errors.username}`}</p>}

      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <div className="flex w-full flex-col gap-3">
            <div className="text-base-semibold text-light-2">Bio</div>
            <div>
              <textarea rows={10} className="account-form_input no-focus w-full" {...field} />
            </div>
          </div>
        )}
      />

      {errors.bio && <p className="text-red-500">{`${errors.bio}`}</p>}

      <button type="submit" className="bg-blue p-3 text-white rounded-lg">
        {btnTitle}
      </button>
    </form>
  );
};

export default AccountProfile;
