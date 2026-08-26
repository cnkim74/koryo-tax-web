import { z } from "zod";
import { inquiryTopics } from "@/content/site";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "성함을 2자 이상 입력해 주세요.")
    .max(40, "성함이 너무 깁니다."),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{3,4}-?\d{4}$/, "연락처 형식을 확인해 주세요. (예: 010-1234-5678)"),
  email: z
    .string()
    .trim()
    .max(120)
    .email("이메일 형식을 확인해 주세요.")
    .optional()
    .or(z.literal("")),
  topic: z.enum(inquiryTopics, { message: "문의 유형을 선택해 주세요." }),
  message: z
    .string()
    .trim()
    .min(10, "문의 내용을 10자 이상 입력해 주세요.")
    .max(2000, "문의 내용은 2000자까지 입력할 수 있습니다."),
  consent: z.literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
  /**
   * 스팸 봇 트랩 — 사람에게는 보이지 않는 필드입니다.
   * 값이 차 있으면 서버에서 조용히 무시합니다(검증 실패로 알려주지 않음).
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
