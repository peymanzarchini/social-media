"use client";

import { z } from "zod";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/utils/validation/thread";
import { addCommentToThread } from "@/utils/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const pathname = usePathname();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

    reset();
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="thread"
        render={({ field }) => (
          <div className="flex w-full items-center gap-3">
            <div>
              <Image
                src={currentUserImg}
                alt="current_user"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
            <div className="border-none bg-transparent">
              <input
                type="text"
                {...field}
                placeholder="Comment..."
                className="account-form_input no-focus w-full"
              />
            </div>
          </div>
        )}
      />

      {errors.thread && <p className="text-red-500">{`${errors.thread.message}`}</p>}

      <button type="submit" className="bg-blue p-3 text-white rounded-lg">
        Reply
      </button>
    </form>
  );
};

export default Comment;
