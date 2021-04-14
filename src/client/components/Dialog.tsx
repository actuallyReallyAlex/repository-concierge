import * as React from "react";
import { Modal } from "antd";
import PullRequestsDialog from "../dialogs/PullRequests";
import SettingsDialog from "../dialogs/Settings";
import { GHPull } from "../types";

interface DialogProps {
  pullRequests: GHPull[];
  setIsModalVisible: (isModalVisible: boolean) => void;
  setModalTitle: (modalTitle: string) => void;
  setPullRequests: (pullRequests: GHPull[]) => void;
  title: string;
  visible: boolean;
}

const contents: {
  [key: string]: React.FunctionComponent<any>;
} = {
  "Pull Requests": PullRequestsDialog,
  Settings: SettingsDialog,
};

const getHandlers = (
  setIsModalVisible: (isModalVisible: boolean) => void,
  setModalTitle: (modalTitle: string) => void,
  title: string
): { onCancel: () => void; onOk: () => void } => {
  const handlers: {
    [key: string]: { onCancel: () => void; onOk: () => void };
  } = {
    "Pull Requests": {
      onCancel: () => {
        console.log("PULL REQUESTS CANCEL");
        setIsModalVisible(false);
        setModalTitle("");
      },
      onOk: () => {
        console.log("PULL REQUESTS OK");
        setIsModalVisible(false);
        setModalTitle("");
      },
    },
    Settings: {
      onCancel: () => {
        console.log("SETTINGS CANCEL");
        setIsModalVisible(false);
        setModalTitle("");
      },
      onOk: () => {
        console.log("SETTINGS OK");
        setIsModalVisible(false);
        setModalTitle("");
      },
    },
  };

  return handlers[title];
};

const Dialog: React.FunctionComponent<DialogProps> = (props: DialogProps) => {
  const {
    pullRequests,
    setIsModalVisible,
    setModalTitle,
    setPullRequests,
    title,
  } = props;
  const Content = contents[title];
  const handlers = getHandlers(setIsModalVisible, setModalTitle, title);

  if (Content) {
    return (
      <Modal {...handlers} {...props} width="90%">
        <Content pullRequests={pullRequests} />
      </Modal>
    );
  } else {
    return null;
  }
};

export default Dialog;
