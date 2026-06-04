import {
  NewButton,
  InputSearch,
  Toggle,
} from "@USupport-components-library/src";

export const OptionsContainer = ({
  showAllMessages,
  setShowAllMessages,
  showOptions,
  setShowOptions,
  areSystemMessagesShown,
  setAreSystemMessagesShown,
  search,
  setSearch,
  t,
}) => {
  return (
    <div className="page__jitsi-room__options-container">
      <NewButton
        size="sm"
        label={t(showOptions ? "hide_options" : "show_options")}
        onClick={() => setShowOptions(!showOptions)}
      />
      {showOptions && (
        <div className="consultation-chat-panel__settings">
          <div className="page__consultation__system-message-toggle">
            <p>{t("show_system_messages")}</p>
            <Toggle
              isToggled={areSystemMessagesShown}
              setParentState={setAreSystemMessagesShown}
            />
          </div>
          <div className="page__consultation__system-message-toggle">
            <p>{t("show_previous_consultations")}</p>
            <Toggle
              isToggled={showAllMessages}
              setParentState={setShowAllMessages}
            />
          </div>
          <InputSearch
            value={search}
            onChange={setSearch}
            placeholder={t("search")}
          />
        </div>
      )}
    </div>
  );
};
