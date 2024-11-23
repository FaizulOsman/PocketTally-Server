/* eslint-disable no-console */

import { FormData } from '../app/modules/formData/formData.model';

const Script = async () => {
  try {
    const allData = await FormData.find({ formId: '65ebd97081bb8921c5d501e9' });
    console.log('Retrieved Data:', allData?.length);

    for (const data of allData) {
      const parsedData = JSON.parse(data.data);
      console.log(parsedData);

      // Update the document in the database
      // await FormData.updateOne(
      //   { _id: data._id },
      //   {
      //     $set: {
      //       data: JSON.stringify(parsedData), // Save the updated `data` back as a JSON string
      //     },
      //   }
      // );
    }
  } catch (error) {
    console.error('Error updating users:', error);
  }
};

export { Script };
