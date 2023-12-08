'use client';
// React
import React, { FC, useContext, useEffect,useState } from "react";

// Contexts
import EthersContext from "../context/EthersContext/EthersContext";

// Custom Component
import { LoadingButton } from "./ui/LoadingButton";
import { Button } from "./ui/button";
import CachedProfilesAndPostsContext from "../context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContext";
import { SocialNetwork } from "../utils/social-network";


const ConnectUniversalProfileButton = () => {
  const { connectUniversalProfile, loading, universalProfile } =
    useContext(EthersContext);
  const [hasNecessaryPermissions, setHasPermissions] = useState<
  undefined | boolean
  >(undefined);

  const { refetchAll } = useContext(CachedProfilesAndPostsContext);
  const {
    provider,
    initSocialProfileData,
    logout,
  } = useContext(EthersContext);

  useEffect(() => {
    if (!universalProfile) {
      setHasPermissions(false);
    } else {
      setHasPermissions(undefined);
      universalProfile.hasNecessaryPermissions().then(setHasPermissions);
    }
  }, [universalProfile]);

  const validate = (): boolean =>
  Boolean(provider) && Boolean(universalProfile);

  const onAgree = async () => {
    if (!(await register())) {
      // toast.error(`Registration failed`);
      return;
    }
    if (!(await setPermissions())) {
      // toast.error(`Setting necessary permissions failed`);
      return;
    }
  };

  const setPermissions = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (await universalProfile!.hasNecessaryPermissions()) return true;

    const hasPermissions = await universalProfile!.setNecessaryPermissions();
    setHasPermissions(hasPermissions);

    return hasPermissions;
  };

  const register = async (): Promise<boolean> => {
    if (!validate()) return false;
    if (universalProfile!.socialNetworkProfileDataERC725Contract) return true; // already registered

    try {
      const tx = await SocialNetwork.connect(provider!.getSigner()).register();
      await tx.wait();
      await initSocialProfileData();
    } catch (e) {
      console.error("❌ register failed: ", e);
      return false;
    }

    await refetchAll();
    return true;
  };
  // useefefetc {}

  const onConnectButton = async () => {
    console.log("on connect was clicked")
    await connectUniversalProfile()
    
    console.log("universal profile connected")
    const isRegistered = await universalProfile?.hasNecessaryPermissions()
    console.log("registerd state?", isRegistered)
    if (!isRegistered) {
      console.log("prompt user to register will cost gas")
      await onAgree()
    }
  }

  return (
    (loading || (!!universalProfile && !universalProfile?.socialNetworkProfileDataContract)) ? <LoadingButton /> : <Button onClick={onConnectButton}>{universalProfile ? "SWITCH PROFILE" : "CONNECT PROFILE"}</Button>
  );
};

export default ConnectUniversalProfileButton;
