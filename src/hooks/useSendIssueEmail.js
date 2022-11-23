import { useMutation } from "@tanstack/react-query";
import { emailSvc } from "@USupport-components-library/services";
import { useError } from "../hooks";

export default function useSendIssueEmail(onSuccess, onError) {
  /**
   *
   * @param {Object} payload with fields "subject", "title" and "text"
   * @returns {Promise}
   */
  const sendIssueEmail = async (payload) => {
    const res = await emailSvc.sendAdmin(payload);
    return res;
  };

  const sendIssueEmailMutation = useMutation(sendIssueEmail, {
    onSuccess,
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage);
    },
  });

  return sendIssueEmailMutation;
}

export { useSendIssueEmail };
