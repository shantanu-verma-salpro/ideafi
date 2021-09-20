import { getFirebaseAdmin } from 'next-firebase-auth'
import firebase from "firebase/app";
import "firebase/firestore";

export default function handler(req, res) {
    const created = getFirebaseAdmin().firestore.FieldValue.serverTimestamp();
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Invalid' })
      return ;
    }
    const body = req.body;
    const fi = {...body,verified:false,createdAt:created,ratings:0,contributions:[body.createdBy]};
    const idea = getFirebaseAdmin().firestore().collection("ideas");
    idea.add(fi).then((vg)=>{
      getFirebaseAdmin().firestore().collection("ratings").doc(`${body.createdBy}_${vg.id}`).set({userId:body.createdBy,ideaId:vg.id,rating:0}).then(()=>{
        res.status(200).send({success:true});
      }).catch(()=>{
        res.status(500).send({success:false});
      })
    }).catch(()=>{
        res.status(500).send({success:false});
    })
  }