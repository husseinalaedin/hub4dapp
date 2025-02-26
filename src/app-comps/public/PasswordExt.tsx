import { Box, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
export const requirements=(t:any) => [
    { re: /[0-9]/, label: t('pwd_include_atlst_one_number',"Includes at least one number") },
    { re: /[a-zA-Z]/, label: t('pwd_include_atlst_one_letter',"Includes at least one letter") }, // Ensures at least one character (uppercase or lowercase)
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: t('pwd_include_atlst_one_spclchar',"Includes at least one special symbol") },
  ];
export const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => {
  return (
    <Text
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};

export const getStrength = (t,password: string) => {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements(t).forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};
