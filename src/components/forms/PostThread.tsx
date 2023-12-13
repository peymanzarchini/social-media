"use client";

import { createThread } from "@/utils/actions/thread.actions";
import { ThreadValidation } from "@/utils/validation/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

interface Props {
  userId: string;
}

const PostThread = ({ userId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <form className="flex flex-col justify-start gap-10" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="thread"
        render={({ field }) => (
          <div className="flex w-full flex-col gap-3">
            <h1 className="text-base-semibold text-light-2 py-2">Content</h1>
            <div className="no-focus border border-dark-4 bg-dark-3 text-light-1">
              <textarea rows={15} {...field} className="account-form_input no-focus w-full" />
            </div>
          </div>
        )}
      />

      {errors.thread && <p className="text-red-500">{`${errors.thread.message}`}</p>}

      <button type="submit" className="bg-blue p-3 text-white rounded-lg">
        Post Thread
      </button>
    </form>
  );
};

export default PostThread;
